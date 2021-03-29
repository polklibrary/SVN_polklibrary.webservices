from plone import api
from plone.i18n.normalizer import idnormalizer
from plone.protect.interfaces import IDisableCSRFProtection
from Products.Five import BrowserView
from zope.interface import alsoProvides
import json

class WSView(BrowserView):

    _data = {}
    
    def __call__(self):
        self._data = { 'status' : 'Error' }
        self.process()
        
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)


    def process(self):        
        alsoProvides(self.request, IDisableCSRFProtection)
        """ do main work here """
        context = api.content.get(path='/library/ws/resources')
        
        computer_id = self.request.form.get('computerId','')
        #print(computer_id)
        #print(idnormalizer.normalize(computer_id))
        available = True 
        if int(self.request.form.get('status', -1)) <= 0:
            available = False
        
        brains = api.content.find(context=context, portal_type='polklibrary.type.computeravailability.models.resource', id=idnormalizer.normalize(computer_id))
        if brains:
            obj = brains[0].getObject()
            obj.activated = available
            obj.reindexObject()
            self._data['status'] = 'Updated'
        else:
            obj = api.content.create(
                        type='polklibrary.type.computeravailability.models.resource',
                        title=computer_id,
                        container=context,
                    )
            obj.activated = available
            obj.resources = u"PC"  # Default since most are
            api.content.transition(obj=obj, transition='publish')
            obj.reindexObject()
            self._data['status'] = 'Created'

        
    @property
    def portal(self):
        return api.portal.get()
        