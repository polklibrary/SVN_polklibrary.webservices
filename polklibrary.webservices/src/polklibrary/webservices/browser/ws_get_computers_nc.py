from plone.memoize import ram
from Products.Five import BrowserView
from BeautifulSoup import BeautifulSoup
import json, datetime, time, requests, re

class WSView(BrowserView):

    def __call__(self):
        data = self.service()
        self.request.response.setHeader('Content-Type', 'application/json')
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        if self.request.form.get('alt','') == 'jsonp':
            return self.request.form.get('callback','?') + '(' + json.dumps(data) + ')'
        return json.dumps(data)
        
    def service(self):
        data = {}
        target = self.request.form.get('target','')
        if target.startswith('https://keyserver.uwosh.edu/'):
            data = {
                'timestamp': str(datetime.datetime.now()),
                'info': self.call_keyserver(target),
            }
        return data
        
    def call_keyserver(self, url):
        url = url + '?nocache=' + str(int(time.time()))
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

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        