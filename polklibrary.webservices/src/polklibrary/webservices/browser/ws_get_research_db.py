from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time,md5

            
def _cache_key(method, self, id):
    return (self.portal.id, time.time() // (60 * 2))
    
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
        results = self.get_cached_results(id)
        
        if id:
            if results:
                self._data = results[0]
        else:
            for result in results:
                self._data[result['id']] = result
            self._data = sorted(list(self._data.values()), key=lambda k: k['Title'].lower())
            

    @ram.cache(_cache_key)
    def get_cached_results(self, id):
        results = []
        if id:
            brains = api.content.find(portal_type='polklibrary.type.rdb.models.database', id=id, sort_on='sortable_title', sort_order='ascending')
        else:
            brains = api.content.find(portal_type='polklibrary.type.rdb.models.database', sort_on='sortable_title', sort_order='ascending')
        for brain in brains:
            results.append(self.transform(brain))
        return results
           
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
            'state':False,
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
        if brain.state == u"On" || brain.state == "On":
            result['state'] = True
            
        return result

    @property
    def portal(self):
        return api.portal.get()

