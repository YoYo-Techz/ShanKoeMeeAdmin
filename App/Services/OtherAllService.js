'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const accountModel  = mongoose.model('account');
const transactionModel  = mongoose.model('transaction');
const withdrawModel  = mongoose.model('withdrawHistory');
const playerModel  = mongoose.model('player');
const otpModel  = mongoose.model('otp');
const DocumentModel  = mongoose.model('uploadDocument');
const uploadModel  = mongoose.model('uploadDocument');
const TestimonialsModel  = mongoose.model('testimonials');
const BlogsModel  = mongoose.model('blogs');
const OffersModel  = mongoose.model('offers');
const BlogCategoriesModel = mongoose.model('blogCategories');
const SEOModel = mongoose.model('SEO');
module.exports = {

	getByAccount: async function(data){
        try {
          return  await accountModel.find(data);
        } catch (e) {
          console.log("getByAccount",e);
        }
	},
	getOneAccount: async function(data){
		try {
			return  await accountModel.findOne(data);
		} catch (e) {
			console.log("getOneAccount",e);
		}
	},

	getByTransaction: async function(data){
	        try {
	          return  await transactionModel.find(data);
	        } catch (e) {
	          console.log("getByTransaction",e);
	        }
	},

	getOneTransaction: async function(data){
	        try {
	          return  await transactionModel.findOne(data);
	        } catch (e) {
	          console.log("getByTransaction",e);
	        }
	},

	createTransaction: async function(data){
	        try {
	          return  await transactionModel.create(data);
	        } catch (e) {
	          console.log("createTransaction",e);
	        }
	},

	updateTransaction: async function(condition,data){
	        try {
	          return  await transactionModel.update(condition,data);
	        } catch (e) {
	          console.log("updateTransaction",e);
	        }
	},

	createWithdraw: async function(data){
	        try {
	          return  await withdrawModel.create(data);
	        } catch (e) {
	          console.log("createTransaction",e);
	        }
	},

	getSingleWithdraw: async function(data){
					try {
						return  await withdrawModel.findOne(data);
					} catch (e) {
						console.log("createTransaction",e);
					}
	},

	getWithdraw: async function(data){
					try {
						return  await withdrawModel.find(data);
					} catch (e) {
						console.log("createTransaction",e);
					}
	},

	getWithdrawDatatable: async function(data, length, start){
					try {
						if(length==-1)
						{
							return  await withdrawModel.find(data);
						}else{
						return await withdrawModel.find(data).skip(start).limit(length);
						}
						} catch (e) {
						console.log("createTransaction",e);
					}
	},

	getBankDatatable: async function(id){
		try {
			return await playerModel.findOne(id);
		} catch (e) {
			console.log("createTransaction",e);
		}
	},

	updateWithdraw: async function(condition,data){
	        try {
	          return  await withdrawModel.update(condition,data);
	        } catch (e) {
	          console.log("updateTransaction",e);
	        }
	},

	getOnePlayer: async function(data){
	        try {
	          return  await playerModel.findOne(data);
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},    
	getPlayer: async function(data){
		try {
			return await withdrawModel.findOne(data).populate('playerId',{email:1});
		} catch (e) {
			console.log("getOnePlayer",e);
		}
}, 
	updatePlayer: async function(condition,data){
	        try {
	          return  await playerModel.update(condition,data);
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},

	createOtp: async function(data){
	        try {
	          return  await otpModel.create(data);
	        } catch (e) {
	          console.log("createTransaction",e);
	        }
	},

	getOneOtp: async function(data){
	        try {
	          return  await otpModel.findOne(data);
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},

	updateOtp: async function(condition,data){
	        try {
	          return  await otpModel.update(condition,data);
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},

	createDocument: async function(data){
	        try {
	          return  await DocumentModel.create(data);
	        } catch (e) {
	          console.log("createDocument",e);
	        }
	},
	getOneDocument: async function(data){
	        try {
	          return  await uploadModel.findOne(data);
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},
	getDocument: async function(data){
	        try {
	          return  await uploadModel.find(data);
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},

	getDocumentDatatable: async function(query, length, start){
	        try {
	          if(length==-1)
          {
            return  await uploadModel.find(query);
          }else{
            return  await uploadModel.find(query).skip(start).limit(length);
          }
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},

	updateDocument: async function(condition,data){
	        try {
	          return  await uploadModel.update(condition,data);
	        } catch (e) {
	          console.log("getOnePlayer",e);
	        }
	},
	createTestimonialsData: async function(data){
	        try {
	          return  await TestimonialsModel.create(data);
	        } catch (e) {
	          console.log("create Testimonials",e);
	        }
	},
	getTestimonials: async function(data){
	        try {
	          return  await TestimonialsModel.find(data);
	        } catch (e) {
	          console.log("get Testimonials",e);
	        }
	},
	getTestimonialDetails: async function(data){
	        try {
	          return  await TestimonialsModel.findOne(data);
	        } catch (e) {
	          console.log("get Testimonials Details",e);
	        }
	},
	updateTestimonialsData: async function(condition,data){
	        try {
	          return  await TestimonialsModel.update(condition,data);
	        } catch (e) {
	          console.log("update Testimonials Data",e);
	        }
	},
	deleteTestimonial: async function(data){
        try {
          await TestimonialsModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  	},
	createBlogsData: async function(data){
	        try {
	          return  await BlogsModel.create(data);
	        } catch (e) {
	          console.log("create Blog",e);
	        }
	},
	getBlogs: async function(data){
	        try {
	          	return  await BlogsModel.find(data).populate('categoryName');
	          //return  await BlogsModel.find(data);
	        } catch (e) {
	          console.log("get Blogs",e);
	        }
	},
	getBlogDetails: async function(data){
	        try {
	          return  await BlogsModel.findOne(data).populate('categoryName');
	        } catch (e) {
	          console.log("get Blog Details",e);
	        }
	},
	updateBlog:async function(cond,data){
		console.log(cond+"----"+data);
	        try {
	          return  await BlogsModel.findOneAndUpdate(cond,data);
	        } catch (e) {
	          console.log("Edit Blog Details",e);
	        }
	},
	getLastBlogDetails: async function(data){
	        try {
	          return  await BlogsModel.findOne(data).sort({createdAt: -1});
	        } catch (e) {
	          console.log("get Blog Details",e);
	        }
	},
	deleteBlog: async function(data){
        try {
          await BlogsModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  	},
	getOffers: async function(data){
	        try {
	          return  await OffersModel.find(data);
	        } catch (e) {
	          console.log("get Offer",e);
	        }
	},
	getOfferDetails: async function(data){
	        try {
	          return  await OffersModel.findOne(data);
	        } catch (e) {
	          console.log("get Offer Details",e);
	        }
	},
	updateOffer:async function(cond,data){
		console.log(cond+"----"+data);
	        try {
	          return  await OffersModel.findOneAndUpdate(cond,data);
	        } catch (e) {
	          console.log("Edit Offer Details",e);
	        }
	},
	createOffersData: async function(data){
	        try {
	          return  await OffersModel.create(data);
	        } catch (e) {
	          console.log("create Offer",e);
	        }
	},
	getLastOfferDetails: async function(data){
	        try {
	          return  await OffersModel.findOne(data).sort({createdAt: -1});
	        } catch (e) {
	          console.log("get Offer Details",e);
	        }
	},
	deleteOffer: async function(data){
        try {
          await OffersModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  	},
	//Blog Categories
	createBlogCategoriesData: async function(data){
	        try {
	          return  await BlogCategoriesModel.create(data);
	        } catch (e) {
	          console.log("create Blog Category",e);
	        }
	},
	getBlogCategories: async function(data){
	        try {
	          return  await BlogCategoriesModel.find(data);
	        } catch (e) {
	          console.log("get Blog Category",e);
	        }
	},
	getBlogCategoriesDetails: async function(data){
	        try {
	          return  await BlogCategoriesModel.findOne(data);
	        } catch (e) {
	          console.log("get Blog Category Details",e);
	        }
	},
	updateBlogCategoriesData:async function(cond,data){
		console.log(cond+"----"+data);
	        try {
	          return  await BlogCategoriesModel.findOneAndUpdate(cond,data);
	        } catch (e) {
	          console.log("Edit Blog Category Details",e);
	        }
	},
	deleteBlogCategories: async function(data){
        try {
          await BlogCategoriesModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  	},
  	createSeoData: async function(data){
        try {
          return  await SEOModel.create(data);
        } catch (e) {
          console.log("create SEO",e);
        }
	},
	updateSeoData:async function(cond,data){
		try {
          return  await SEOModel.findOneAndUpdate(cond,data);
        } catch (e) {
          console.log("Edit SEO Details",e);
        }
	},
  	getSeos: async function(data){
        try {
          	return  await SEOModel.find(data);
        } catch (e) {
          console.log("get SEO",e);
        }
	},
	getSeoDetails: async function(data){
        try {
          return  await SEOModel.findOne(data);
        } catch (e) {
          console.log("get SEO Details",e);
        }
	},
	deleteSeo: async function(data){
        try {
          await SEOModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  	},
}
