from plone import api
from Products.Five import BrowserView

import json

class WSView(BrowserView):

    _data = {}
    
    def __call__(self):
        self._data = {}
        self.process()
        
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

        
    def process(self):
        """ do main work here """
        context = api.content.get(path='/library/ws/resources')
        
        computer_id = self.request.form.get('computerId','')
        available = True 
        if int(self.request.form.get('status', -1)) <= 0:
            available = False
        
        brains = api.content.find(context=context, portal_type='resource_availability', title=computer_id)
        if brains:
            obj = brains[0].getObject()
            obj.available = available
            obj.reindexObject()
        else:
            obj = api.content.create(
                        type='resource_availability',
                        title=computer_id,
                        container=context,
                    )
            obj.available = available
            obj.reindexObject()

        
    @property
    def portal(self):
        return api.portal.get()
        