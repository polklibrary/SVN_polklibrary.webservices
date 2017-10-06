from plone.memoize import ram
from Products.Five import BrowserView
from BeautifulSoup import BeautifulSoup
import json, datetime, time, requests, re

CACHED_TIME = 60

class WSView(BrowserView):

    def __call__(self):
        data = self.service()
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(data) + ')'
        return json.dumps(data)

        
    @ram.cache(lambda *args: time.time() // (CACHED_TIME))
    def service(self):
        data = {
            'cached': str(datetime.datetime.now()),
            'cached_time': CACHED_TIME,
            'locations' : {
                'reference': self.call_keyserver('http://keyserver.uwosh.edu/public/maps.html?ptype=divn&pdata=0x0000FFE5&pname=Reference'),
                'catalog': self.call_keyserver('http://keyserver.uwosh.edu/public/maps.html?ptype=divn&pdata=0x0000FFFC&pname=Catalog'),
                'govdocs': self.call_keyserver('http://keyserver.uwosh.edu/public/maps.html?ptype=divn&pdata=0x0000FFEC&pname=Gov%20Docs'),
                'emc': self.call_keyserver('http://keyserver.uwosh.edu/public/maps.html?ptype=divn&pdata=0x0000FFF2&pname=EMC'),
                'groupstudy': self.call_keyserver('http://keyserver.uwosh.edu/public/maps.html?ptype=divn&pdata=0x0000FFD0&pname=Group%20Study%20Rooms'),
                'checkout': self.call_keyserver('http://keyserver.uwosh.edu/public/maps.html?ptype=divn&pdata=0x0000FFBA&pname=Checkout'),
            }
        }
    
        return data
        
    def call_keyserver(self, url):
        request = requests.get(url, verify=False, timeout=15)
        soup = BeautifulSoup(request.text)
        divs = soup.findAll('div', {'class': lambda x: x and 'av-comp' in x})

        computers = {}
        for div in divs:
            if 'used' in div['class']:
                computers[div['data-info-name']] = 0;
            else:
                computers[div['data-info-name']] = 1;
            
        return computers

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        