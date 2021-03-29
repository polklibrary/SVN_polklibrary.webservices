from plone.memoize import ram
from Products.Five import BrowserView
from bs4 import BeautifulSoup
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
        self.request.response.setHeader('Cache-Control', 'no-cache, no-store')
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(data) + ')'
        return json.dumps(data)

        
    def service(self):
        ip = self.get_ip()
        
        data = {
            'ip' : str(ip),
        }
        
        if self.is_ip_in_range(ip, "141.233.148.1", "141.233.151.254"): # users
            data['location'] = self.FOX_LOCATION
        elif self.is_ip_in_range(ip, "141.233.170.1", "141.233.171.254"): # classrooms/labs
            data['location'] = self.FOX_LOCATION
        elif self.is_ip_in_range(ip, "143.235.160.0", "143.235.167.255"): # old ip range
            data['location'] = self.FOX_LOCATION
        
        elif self.is_ip_in_range(ip, "141.233.152.1", "141.233.155.254"): # users
            data['location'] = self.FOND_LOCATION
        elif self.is_ip_in_range(ip, "141.233.172.1", "141.233.173.254"): # classrooms/labs
            data['location'] = self.FOND_LOCATION
        elif self.is_ip_in_range(ip, "143.235.152.0", "143.235.159.255"): # old ip range
            data['location'] = self.FOND_LOCATION
            
        elif self.is_ip_in_range(ip, "141.233.0.0", "141.233.255.255"): # all uwo
            data['location'] = self.OSHKOSH_LOCATION

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
            ip = '0.0.0.0'

        if ',' in ip:
            ips = ip.split(',')
            return ips[0]
            
        return ip
            
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        