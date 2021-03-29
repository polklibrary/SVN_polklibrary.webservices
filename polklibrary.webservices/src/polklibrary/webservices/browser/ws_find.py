from plone import api
from plone.memoize import ram
from Products.Five import BrowserView

import json,time

class WSView(BrowserView):

    _data = {}

    def __call__(self):
        self._data = {}
        self.process()
        self.request.response.setHeader('Content-Type', 'application/json')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)


    def process(self):
        """ do main work here """
        self._data['found'] = []
        text = self.request.form.get('text', '&%^&$$#')
        brains = api.content.find(portal_type=('polklibrary.type.coursepages.models.page','polklibrary.type.subjects.models.subject','Document',))
        for brain in brains:
            obj = brain.getObject()
            if hasattr(obj, 'body') and obj.body != None and brain.portal_type == 'polklibrary.type.coursepages.models.page':
                if text in obj.body.output:
                    self._data['found'].append(brain.getURL())
            if hasattr(obj, 'body') and obj.body != None and brain.portal_type == 'polklibrary.type.subjects.models.subject':
                if text in obj.body.output:
                    self._data['found'].append(brain.getURL())
            if hasattr(obj, 'body') and obj.body != None and brain.portal_type == 'Document':
                if text in obj.body.output:
                    self._data['found'].append(brain.getURL())


    @property
    def portal(self):
        return api.portal.get()

