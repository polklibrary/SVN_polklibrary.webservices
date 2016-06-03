from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json

class WSView(BrowserView):

    _data = {}

    #@ram.cache(lambda *args: time() // (60 * 10))
    def __call__(self):
        self._data = {}
        self.process()

        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        
        return json.dumps(self._data)


    def process(self):
        """ do main work here """
        id = self.request.form.get('id', None)
        if id:
            brains = api.content.find(portal_type='polklibrary.type.rdb.models.database', id=id, sort_on='sortable_title', sort_order='ascending')
            if brains:
                self._data = self.transform(brains[0])
        else:
            brains = api.content.find(portal_type='polklibrary.type.rdb.models.database', sort_on='sortable_title', sort_order='ascending')
            for brain in brains:
                self._data[brain.getId] = self.transform(brain)
            self._data = sorted(list(self._data.values()), key=lambda k: k['Title'])
            
           
    def transform(self, brain):
        result = {
            'id':brain.getId,
            'getId':brain.getId,
            'Title':brain.Title,
            'Description':brain.Description,
            'getURL':brain.getURL(),
            'getRemoteUrl':brain.getRemoteUrl,
            'message_type': '',
            'message': '',
            'tutorial': '',
            'resources':brain.resources,
        }
        
        if brain.activated:
            obj = brain.getObject()
            if obj.message:
                result['message_type'] = obj.activated
                result['message'] = obj.message.output
        if brain.reference:
            result['tutorial'] = brain.reference
        return result

    @property
    def portal(self):
        return api.portal.get()

