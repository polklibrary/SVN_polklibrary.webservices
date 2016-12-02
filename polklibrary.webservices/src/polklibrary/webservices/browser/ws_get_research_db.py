from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time,md5

class WSView(BrowserView):

    _data = {}

    def __call__(self):
        self._data = {}
        self.process()

        self.request.response.setHeader('ETag', md5.new(str(self._data)).hexdigest())
        self.request.response.setHeader('Cache-Control', 'max-age=60, s-maxage=60, public, must-revalidate')
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)


    def process(self):
        """ do main work here """
        id = self.request.form.get('id', None)
        brains = self.get_cached_brains(id)
        if id:
            if brains:
                self._data = self.transform(brains[0])
        else:
            for brain in brains:
                self._data[brain.getId] = self.transform(brain)
            self._data = sorted(list(self._data.values()), key=lambda k: k['Title'].lower())
            

    @ram.cache(lambda *args: time.time() // (60 * 2))
    def get_cached_brains(self, id):
        if id:
            return api.content.find(portal_type='polklibrary.type.rdb.models.database', id=id, sort_on='sortable_title', sort_order='ascending')
        else:
            return api.content.find(portal_type='polklibrary.type.rdb.models.database', sort_on='sortable_title', sort_order='ascending')
    
           
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
            'disciplines':[],
        }
        
        if brain.activated:
            obj = brain.getObject()
            if obj.message:
                result['message_type'] = obj.activated
                result['message'] = obj.message.output
        if brain.reference:
            result['tutorial'] = brain.reference
        if brain.disciplines:
            result['disciplines'] = brain.disciplines
        return result

    @property
    def portal(self):
        return api.portal.get()

