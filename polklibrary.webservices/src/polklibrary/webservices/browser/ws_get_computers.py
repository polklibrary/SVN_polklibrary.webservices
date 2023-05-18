from plone.memoize import ram
from Products.Five import BrowserView
from bs4  import BeautifulSoup
import json, datetime, time, requests, re

CACHED_TIME = 60 * 2

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
                'reference': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/64049f5a12359de9079631451b88a44a/list'),
                'catalog': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/fee156df0fa3eca2a4350bf04464c1f0'),
                'govdocs': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/234b0690280325338d1e6c20ec44e730'),
                'emc': self.call_keyserver('https://keyserver.uwosh.edu/maps/std/37be0097953b29d1ba860623d356bd01'),
            }
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
        
    # def call_keyserver(self, url):
        # request = requests.get(url, verify=False, timeout=15)
        # soup = BeautifulSoup(request.text)        
        # divs = soup.findAll('div', {'class': lambda x: x and 'av-comp' in x})

        # computers = {}
        # for div in divs:
            # if 'data-info-name' in str(div) and 'class' in str(div):
                # if 'used' in div['class']:
                    # computers[div['data-info-name']] = 0;
                # else:
                    # computers[div['data-info-name']] = 1;
        # return computers

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        