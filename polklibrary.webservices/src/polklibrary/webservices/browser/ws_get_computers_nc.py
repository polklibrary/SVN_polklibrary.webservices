from plone.memoize import ram
from Products.Five import BrowserView
from bs4  import BeautifulSoup
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
        
        computers = {}
        elements = soup.findAll('div', {'class': lambda x: x and 'av-comp' in x})
        if elements: # DIV FINDER
            #print("DIV FINDER "  + str(len(elements)))
            for elem in elements:
                if 'data-info-name' in str(elem) and 'class' in str(elem):
                    if 'used' in elem['class']:
                        computers[elem['data-info-name']] = 0;
                    else:
                        computers[elem['data-info-name']] = 1;
                        
        else: # TR FINDER
            elements = soup.findAll('tr', {'class': lambda x: x and 'av-comp' in x})
            #print("TR FINDER " + str(len(elements)))
            for elem in elements:
                if 'data-info-id' in str(elem) and 'class' in str(elem):
                    innerelem = elem.find('span', {'class':'av-name'})
                    if 'used' in elem['class']:
                        computers[innerelem['data-name']] = 0;
                    else:
                        computers[innerelem['data-name']] = 1;   
                    
                    
        return computers
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        