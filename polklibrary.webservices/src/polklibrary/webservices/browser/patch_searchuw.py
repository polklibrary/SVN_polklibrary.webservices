from plone import api
from plone.memoize import ram
from Products.Five import BrowserView
from plone.app.textfield.value import RichTextValue
from plone.app.textfield import RichText
from plone.protect.interfaces import IDisableCSRFProtection
from zope.interface import alsoProvides


import json

class WSView(BrowserView):

    output = ''

    def __call__(self):
        alsoProvides(self.request, IDisableCSRFProtection)
        
        run_all = self.request.form.get('subs','0')
        if run_all == '1':
            self.process_subs()
        else:
            self.obj_targets(self.context)
            
        return self.output

    
    def patch(self, text):
        #text = text.replace('https://uwi-primoalma-prod.hosted.exlibrisgroup.com/primo-explore/','https://wisconsin-uwosh.primo.exlibrisgroup.com/discovery/')
        text = text.replace('https://uwi-primoalma-prod.hosted.exlibrisgroup.com/permalink/','https://wisconsin-uwosh.primo.exlibrisgroup.com/permalink/')
        
        #text = text.replace('http://uwi-primoalma-prod.hosted.exlibrisgroup.com/primo-explore/','https://wisconsin-uwosh.primo.exlibrisgroup.com/discovery/')
        text = text.replace('http://uwi-primoalma-prod.hosted.exlibrisgroup.com/permalink/','https://wisconsin-uwosh.primo.exlibrisgroup.com/permalink/')
    
        #text = text.replace('https://uw-primo.hosted.exlibrisgroup.com/primo-explore/','https://wisconsin-uwosh.primo.exlibrisgroup.com/discovery/')
        text = text.replace('https://uw-primo.hosted.exlibrisgroup.com/permalink/','https://wisconsin-uwosh.primo.exlibrisgroup.com/permalink/')
        text = text.replace('https://uw-primo.hosted.exlibrisgroup.com/','https://wisconsin-uwosh.primo.exlibrisgroup.com/')
        
        #text = text.replace('http://uw-primo.hosted.exlibrisgroup.com/primo-explore/','https://wisconsin-uwosh.primo.exlibrisgroup.com/discovery/')
        text = text.replace('http://uw-primo.hosted.exlibrisgroup.com/permalink/','https://wisconsin-uwosh.primo.exlibrisgroup.com/permalink/')
        text = text.replace('http://uw-primo.hosted.exlibrisgroup.com/','https://wisconsin-uwosh.primo.exlibrisgroup.com/')
        
        
        # text = text.replace('vid=OSH','vid=01UWI_OSH:OSH')
        # text = text.replace('search_scope=OSH_ALL','search_scope=DN_and_CI');
        # text = text.replace('search_scope=OSH_PCI','search_scope=CentralIndex');
        # text = text.replace('search_scope=OSH_ALMA','search_scope=MyInstitution');
        # text = text.replace('search_scope=UW_ALMA','search_scope=DiscoveryNetwork');
        # text = text.replace('search_scope=UW_DIGCOLL','search_scope=UW_DIGCOLL');
        # text = text.replace('search_scope=OSH_Archive','search_scope=OSH_Archive');
        # text = text.replace('search_scope=OSH_CR','search_scope=CourseReserves');
        
        return text
            
            
    def obj_targets(self, obj):
        found = 0
        
        if hasattr(obj, 'text') and hasattr(obj.text, 'output'):
            obj.text = RichTextValue(self.patch(obj.text.output), 'text/html', 'text/html')
            found+=1
            
        if hasattr(obj, 'body') and hasattr(obj.body, 'output'):
            obj.body = RichTextValue(self.patch(obj.body.output), 'text/html', 'text/html')
            found+=1
            
        if hasattr(obj, 'prebody') and hasattr(obj.prebody, 'output'):
            obj.prebody = RichTextValue(self.patch(obj.prebody.output), 'text/html', 'text/html')
            found+=1
            
        if hasattr(obj, 'message') and obj.message and hasattr(obj.message, 'output'):
            obj.message = RichTextValue(self.patch(obj.message.output), 'text/html', 'text/html')
            found+=1
            
        if hasattr(obj, 'getRemoteUrl'):
            obj.getRemoteUrl = self.patch(obj.getRemoteUrl)
            found+=1
            
        if hasattr(obj, 'html'):
            obj.html = self.patch(obj.html)
            found+=1
        
        print "Object done: " + str(found) + " -- "+ obj.absolute_url()
        self.output += str(found) + " -- "+ obj.absolute_url() + '\n'
        obj.reindexObject()
        
    def process_subs(self):
        brains = api.content.find(context=self.context, depth=1)
        
        for brain in brains:
            self.obj_targets(brain.getObject())
        
        
    @property
    def portal(self):
        return api.portal.get()
        