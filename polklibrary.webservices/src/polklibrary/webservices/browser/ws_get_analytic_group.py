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
        
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(self._data) + ')'
        return json.dumps(self._data)

        
    def process(self):
        staff_ips = [
            '141.233.220.75',
        ]
        internal_staff_ips = [
        
        ]
        internal_public_ips = [
        
        ]
        instructional_ips = [
        
        ]
        
        ip = self.get_ip()
        
        if ip in staff_ips:
            self._data['group'] = 'Staff'
        elif ip in staff_ips:
            self._data['group'] = 'Internal Staff'
        elif ip in staff_ips:
            self._data['group'] = 'Internal Public'
        elif ip in staff_ips:
            self._data['group'] = 'Instructional'
        else:
            self._data['group'] = 'External'
        
        
    def get_ip(self):
        ip = ''
        if 'HTTP_X_FORWARDED_FOR' in self.request.environ:
            ip = self.request.environ['HTTP_X_FORWARDED_FOR'] # Virtual host
        elif 'HTTP_HOST' in self.request.environ:
            ip = self.request.environ['REMOTE_ADDR'] # Non-virtualhost
        ipl = ip.split(',')
        return ipl[0].strip()
        
        
    @property
    def portal(self):
        return api.portal.get()
        