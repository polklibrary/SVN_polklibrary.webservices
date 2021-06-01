from plone import api
from Products.Five import BrowserView

import json,datetime

class WSView(BrowserView):

    def __call__(self):
        self.request.response.setHeader('Content-Type', 'application/json')
        data = {'check_time': str(datetime.datetime.now())}
        return json.dumps(data)

    @property
    def portal(self):
        return api.portal.get()

