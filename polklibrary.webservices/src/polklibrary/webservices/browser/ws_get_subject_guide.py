from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time,hashlib


def _cache_key(method, self):
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
        results = self.get_cached_results()
        for result in results:
            self._data[result['id']] = result

        if 'id' in self.request.form:
            d = self._data.get(self.request.form.get('id'), None)
            self._data = d
        else:
            self._data = sorted(list(self._data.values()), key=lambda k: k['Title'])

            
    @ram.cache(lambda *args: time.time() // 60*2)
    def get_cached_results(self):
        results = []
        brains = api.content.find(Subject=('ShowOnSubjectDropDown'), sort_on='sortable_title', sort_order='ascending')
        for brain in brains:
            results.append(self.transform(brain))
        return results
        
    def transform(self, brain):
        excluded = False
        if brain.exclude_from_nav == True:
            excluded = True
        
        return {
            'id':brain.getId,
            'getId':brain.getId,
            'Title':brain.Title,
            'Description':brain.Description,
            'getURL':brain.getURL(),
            'exclude_from_nav':excluded,
        }


    @property
    def portal(self):
        return api.portal.get()

