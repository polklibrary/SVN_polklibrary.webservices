# -*- coding: utf-8 -*-
from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.robotframework.testing import REMOTE_LIBRARY_BUNDLE_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import polklibrary.webservices


class PolklibraryWebservicesLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        self.loadZCML(package=polklibrary.webservices)

    def setUpPloneSite(self, portal):
        applyProfile(portal, 'polklibrary.webservices:default')


POLKLIBRARY_WEBSERVICES_FIXTURE = PolklibraryWebservicesLayer()


POLKLIBRARY_WEBSERVICES_INTEGRATION_TESTING = IntegrationTesting(
    bases=(POLKLIBRARY_WEBSERVICES_FIXTURE,),
    name='PolklibraryWebservicesLayer:IntegrationTesting'
)


POLKLIBRARY_WEBSERVICES_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(POLKLIBRARY_WEBSERVICES_FIXTURE,),
    name='PolklibraryWebservicesLayer:FunctionalTesting'
)


POLKLIBRARY_WEBSERVICES_ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        POLKLIBRARY_WEBSERVICES_FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        z2.ZSERVER_FIXTURE
    ),
    name='PolklibraryWebservicesLayer:AcceptanceTesting'
)
