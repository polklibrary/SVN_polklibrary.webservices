from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time,hashlib

            
def _twominutes_cachekey(method, self):
    return (self.request.ACTUAL_URL + "?" + self.request.QUERY_STRING, time.time() // (60 * 2))

def _cache_key(method, self, id):
    return (self.portal.id, time.time() // (60 * 2))
    
class WSView(BrowserView):

    _data = {}

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
        results = self.get_cached_results(id)
        
        if id:
            if results:
                items = list(filter(lambda x: x['id'] == id, results))
                if items:
                    self._data = items[0]
        else:
            self._data = sorted(results, key=lambda k: k['Title'].lower())
            

    @ram.cache(lambda *args: time.time() // 60 * 2)
    def get_cached_results(self, id):
        results = []
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
        }
        
        excluded = False
        if brain.exclude_from_nav == True:
            excluded = True
        result['exclude_from_nav'] = excluded
        
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

