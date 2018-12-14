from plone.memoize import ram
from Products.Five import BrowserView
from BeautifulSoup import BeautifulSoup
import json, datetime, time, requests, re

CACHED_TIME = 60

class WSView(BrowserView):

    OSHKOSH_LOCATION = 'campus-osh'
    FOND_LOCATION = 'campus-fond'
    FOX_LOCATION = 'campus-fox'
    NO_LOCATION = 'campus-none'
    TEST_LOCATION = 'campus-test'


    def __call__(self):
        data = self.service()
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(data) + ')'
        return json.dumps(data)

        
    #@ram.cache(lambda *args: time.time() // (CACHED_TIME))
    def service(self):
        ip = self.get_ip()
        
        data = {
            'ip' : ip,
        }
        
        if self.is_ip_in_range(ip, "141.233.0.0", "141.233.255.255"):
            data['location'] = self.OSHKOSH_LOCATION
        elif self.is_ip_in_range(ip, "0", "1"):
            data['location'] = self.FOND_LOCATION
        elif self.is_ip_in_range(ip, "0", "1"):
            data['location'] = self.FOX_LOCATION
        elif self.is_ip_in_range(ip, "10.0.0.0", "10.0.255.255"):
            data['location'] = self.TEST_LOCATION
        else:
            data['location'] = self.NO_LOCATION
        
        return data

    # dirt simple way to detect IP in ranges
    def is_ip_in_range(self, ip, range_start, range_end):
    
        min_ip = [int(x) for x in range_start.split('.')]
        max_ip = [int(x) for x in range_end.split('.')]
        current_ip = [int(x) for x in ip.split('.')]
        
        if min_ip[0] <= current_ip[0] and max_ip[0] >= current_ip[0]:
            if min_ip[1] <= current_ip[1] and max_ip[1] >= current_ip[1]:
                if min_ip[2] <= current_ip[2] and max_ip[2] >= current_ip[2]:
                    if min_ip[3] <= current_ip[3] and max_ip[3] >= current_ip[3]:
                        return True
        return False
        
        
    def get_ip(self):
        if "HTTP_X_FORWARDED_FOR" in self.request.environ:
            # Virtual host
            ip = self.request.environ["HTTP_X_FORWARDED_FOR"]
        elif "HTTP_HOST" in self.request.environ:
            # Non-virtualhost
            ip = self.request.environ["REMOTE_ADDR"]
        else:
            # Unit test code?
            ip = None

        return ip
            
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        