from plone import api
from plone.memoize import ram
from Products.Five import BrowserView
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from Products.CMFCore.utils import getToolByName

import json,time


def _cache_key(method, self):
    return (self.portal.id, time.time() // (60 * 60))

class WSView(BrowserView):

    template = ViewPageTemplateFile("patch_resolveuid.pt")

    def __call__(self):
        self.request.response.setHeader('Content-Type', 'text/javascript')
        return self.template()

    def get_all_uids(self):
        return self.get_cached_results()
        
    @ram.cache(_cache_key)
    def get_cached_results(self):
        results = {}
        #brains = api.content.find()
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog()
        for brain in brains:
            results[brain.UID] = brain.getURL()
        return results

    @property
    def portal(self):
        return api.portal.get()

