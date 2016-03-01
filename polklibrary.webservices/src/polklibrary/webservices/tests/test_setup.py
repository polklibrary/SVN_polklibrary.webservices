# -*- coding: utf-8 -*-
"""Setup tests for this package."""
from polklibrary.webservices.testing import POLKLIBRARY_WEBSERVICES_INTEGRATION_TESTING  # noqa
from plone import api

import unittest


class TestSetup(unittest.TestCase):
    """Test that polklibrary.webservices is properly installed."""

    layer = POLKLIBRARY_WEBSERVICES_INTEGRATION_TESTING

    def setUp(self):
        """Custom shared utility setup for tests."""
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')

    def test_product_installed(self):
        """Test if polklibrary.webservices is installed with portal_quickinstaller."""
        self.assertTrue(self.installer.isProductInstalled('polklibrary.webservices'))

    def test_browserlayer(self):
        """Test that IPolklibraryWebservicesLayer is registered."""
        from polklibrary.webservices.interfaces import IPolklibraryWebservicesLayer
        from plone.browserlayer import utils
        self.assertIn(IPolklibraryWebservicesLayer, utils.registered_layers())


class TestUninstall(unittest.TestCase):

    layer = POLKLIBRARY_WEBSERVICES_INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.installer = api.portal.get_tool('portal_quickinstaller')
        self.installer.uninstallProducts(['polklibrary.webservices'])

    def test_product_uninstalled(self):
        """Test if polklibrary.webservices is cleanly uninstalled."""
        self.assertFalse(self.installer.isProductInstalled('polklibrary.webservices'))

    def test_browserlayer_removed(self):
        """Test that IPolklibraryWebservicesLayer is removed."""
        from polklibrary.webservices.interfaces import IPolklibraryWebservicesLayer
        from plone.browserlayer import utils
        self.assertNotIn(IPolklibraryWebservicesLayer, utils.registered_layers())
