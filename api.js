"use strict";

const Homey = require('homey');
module.exports = {
    async getDevices({ homey, query }) {
        return await homey.app.getDevices();    
    },   
    async getCustomIcons({ homey, query }) {
        return await homey.app.getCustomIcons();    
    },
    async setFromDefaultIcon({ homey,  body: { customicon, defaulticon } }) {
        return await homey.app.setFromDefaultIcon({ customicon, defaulticon });
    },
    async getIcons({ homey, query }) {
        return await homey.app.getIcons();    
    },
    async getIcon({ homey, params: {id} }) {
        return await homey.app.getIcon({ id }); 
    },
    async createIcon({ homey,  body: { type, name, buffer  }}) {
        return await homey.app.createIcon({type,name,buffer});
    },
    async createDeviceIcon({ homey,  body: { type, name, buffer, id  }}) {
        return await homey.app.createDeviceIcon({type,name,buffer, id});
    },
    async createCustomIcon({ homey,  body: { type, name, buffer, id  }}) {
        return await homey.app.createCustomIcon({type,name,buffer, id});
    },
    async updateIcon({ homey,  params: { id }, body: {  name } }) {
        return await homey.app.updateIcon({id,name});
    },
    async deleteIcon({ homey,  params: { id } }) {
        return await homey.app.deleteIcon({id});
    }
};
// module.exports = [

// 	{
// 		method: 'GET',
// 		path: '/',
// 		fn: async ({}) => {
// 			return Homey.app.getIcons();
// 		},
// 	},

// 	{
// 		method: 'GET',
// 		path: '/',
// 		fn: async ({ params: { id } }) => {
// 			return Homey.app.getIcon({ id });
// 		},
// 	},

// 	{
// 		method: 'POST',
// 		path: '/',
// 		fn: async ({ body: { type, name, buffer } }) => {
// 			return Homey.app.createIcon({
// 				type,
// 				name,
// 				buffer,
// 			});
// 		},
// 	},

// 	{
// 		method		: 'PUT',
// 		path		: '/:id',
// 		fn: async ({ params: { id }, body: {  name } }) => {
// 			return Homey.app.updateIcon({
// 				id,
// 				name,
// 			});
// 		},
// 	},

// 	{
// 		method		: 'DELETE',
// 		path		: '/:id',
// 		fn: async ({ params: { id } }) => {
// 			return Homey.app.deleteIcon({ id });
// 		},
// 	}

// ]