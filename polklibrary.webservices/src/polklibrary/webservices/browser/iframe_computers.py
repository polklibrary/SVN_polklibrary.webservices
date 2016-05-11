from plone import api
from plone.app.textfield.value import RichTextValue
from Products.Five import BrowserView
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

class IframeComputersPlain(BrowserView):

    template = ViewPageTemplateFile("iframe_computers.pt")
    
    def __call__(self):
        self.request.response.setHeader('Access-Control-Allow-Origin', '*')
        self.request.response.setHeader('Content-Security-Policy', 'frame-ancestors uwosh.edu *.uwosh.edu localhost')
        return self.template()
    
    @property
    def portal(self):
        return api.portal.get()