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
        brains = api.content.find(portal_type='polklibrary.type.subjects.models.subject', sort_on='sortable_title', sort_order='ascending')
        for brain in brains:
            self._data[brain.getId] = self.transform(brain)

        if 'id' in self.request.form:
            d = self._data.get(self.request.form.get('id'), None)
            self._data = d
        else:
            self._data = sorted(list(self._data.values()), key=lambda k: k['Title'])

    def transform(self, brain):
        return {
            'id':brain.getId,
            'getId':brain.getId,
            'Title':brain.Title,
            'Description':brain.Description,
            'getURL':brain.getURL()
        }


    @property
    def portal(self):
        return api.portal.get()

