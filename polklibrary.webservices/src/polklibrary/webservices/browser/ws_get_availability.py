from plone import api
from plone.memoize import ram
from Products.Five import BrowserView
import json,datetime, time

class WSView(BrowserView):

    _data = {}
    
    def __call__(self):
        self._data = {
            "cached": str(datetime.datetime.now()),
            "study_areas": [],
            "locations": [],
        }
        #self.process()
        
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

    # @ram.cache(lambda *args: time.time() // (60))
    # def process(self):
        # """ do main work here """
        # context = api.content.get(path='/library/ws/resources')

        # brains = api.content.find(context=context, portal_type='polklibrary.type.computeravailability.models.resource')
        
        # allresources = []
        # for brain in brains:
            # allresources.append({
                # 'status': int(brain.activated),
                # 'name': brain.Title,
                # 'type': brain.resources,
                # 'location': brain.reference,
            # })
            
        # self.add_location(filter(lambda x: x['location']=='1st North - EMC' and x['type']=='PC', allresources))
        # self.add_location(filter(lambda x: x['location']=='1st North - EMC' and x['type']=='MAC', allresources))
        # self.add_location(filter(lambda x: x['location']=='1st North - Polk Lab' and x['type']=='PC', allresources))
        # self.add_location(filter(lambda x: x['location']=='1st North - Polk Lab' and x['type']=='MAC', allresources))
        # self.add_location(filter(lambda x: x['location']=='1st South - Polk 101' and x['type']=='PC', allresources))
        # self.add_location(filter(lambda x: x['location']=='1st South - Polk 101' and x['type']=='MAC', allresources))
            
        # self.add_location(filter(lambda x: x['location']=='2nd North - Main Stacks' and x['type']=='PC', allresources))
        # self.add_location(filter(lambda x: x['location']=='2nd South - Periodicals' and x['type']=='PC', allresources))
        
        # self.add_location(filter(lambda x: x['location']=='3rd North - Quiet Study' and x['type']=='PC', allresources))
        # self.add_location(filter(lambda x: x['location']=='3rd South - Gov Info' and x['type']=='PC', allresources))
        
        
            
    # def add_location(self, resources):
        # if resources:
            # type = resources[0]['type']
            # location = resources[0]['location']
            
            # self._data['locations'].append({
                # 'available': len(filter(lambda x: x['status']==1, resources)),
                # 'unavailable': len(filter(lambda x: x['status']==0, resources)),
                # 'name': location,
                # 'total': len(resources),
                # 'type': type,
                # 'resources': resources,
            # })
        
        
        
    @property
    def portal(self):
        return api.portal.get()
        