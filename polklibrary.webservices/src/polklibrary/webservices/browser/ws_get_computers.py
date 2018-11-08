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
                'reference': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/2286e8e2639f6543881fdf00f64ce78c'),
                'catalog': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/3969fe58fa01f342be8d2c11980f4f7b'),
                'govdocs': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/5e4d5568a458c74b80f785599b426798'),
                'emc': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/b3c2ee7716db924096ea02446d9ba030'),
                'groupstudy': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/3f975ab97682994ab2d88c57946f6d62'),
                'checkout': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/75df35928d188c45bb8f37f0ad425599'),
                'polk118': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/35001ade90506b409e27b3f2357b5e40'),
            }
        }
    
        return data
        
    def call_keyserver(self, url):
        request = requests.get(url, verify=False, timeout=15)
        soup = BeautifulSoup(request.text)        
        divs = soup.findAll('div', {'class': lambda x: x and 'av-comp' in x})

        computers = {}
        for div in divs:
            if 'data-info-name' in str(div) and 'class' in str(div):
                if 'used' in div['class']:
                    computers[div['data-info-name']] = 0;
                else:
                    computers[div['data-info-name']] = 1;
        return computers

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        