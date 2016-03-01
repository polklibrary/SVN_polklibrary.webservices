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
        
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

        
    def process(self):
        """ do main work here """
        brains = api.content.find(portal_type='polklibrary.type.rdb.models.database')
        for brain in brains:
            self._data[brain.getId] = self.transform(brain)
            
        if 'id' in self.request.form:
            d = self._data.get(self.request.form.get('id'), None)
            self._data = d
        
        
    def transform(self, brain):
        return {
            'id':brain.getId,
            'getId':brain.getId,
            'Title':brain.Title,
            'Description':brain.Description,
            'getURL':brain.getURL(),
            'getRemoteUrl':brain.getRemoteUrl,
            'resources':brain.resources,
        }
        
      
    @property
    def portal(self):
        return api.portal.get()
        