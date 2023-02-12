var express = require('express'), router = express.Router();
var Sys = require('../../Boot/Sys');

// add passport modules for social media integration
const passport = require('passport');
const passport_conf=require('../../Config/passport')(passport);

// Load Your Cutom Middlewares
router.get('/backend',Sys.App.Middlewares.Frontend.frontRequestCheck, function(req, res) {
    res.send('This is Backend')
})

// router.get('/rummyassets',Sys.App.Controllers.SettingsController.gameSetting);
router.get('/rummyassets', async function(req,res){
    console.log("Rummy Asset Called");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // next();
    let practicePointsLobby = [];
    let practicePoolLobby = [];

    let practiceDealsLobby = [];

    let pointsJson = await Sys.App.Services.gameSettingsServices.getByData({gameType : 'points'});
    let poolJson = await Sys.App.Services.gameSettingsServices.getByData({gameType : 'pool'});
    let dealJson = await Sys.App.Services.gameSettingsServices.getByData({gameType : 'deal'});
    let points21Json = await Sys.App.Services.gameSettingsServices.getByData({gameType : 'points_21'});
    let points24Json = await Sys.App.Services.gameSettingsServices.getByData({gameType : 'points_24'});

    // get version
    let currentVersion = await Sys.App.Services.SettingsServices.getAllSettingsData();

    practicePointsLobby.push({
      pointValue : 10,
      entryFee : 1000,
      decks : 1,
      noOfSeats : 2,
      gameType : 'points',
      name : 'Point Rummy'
    })

    practicePointsLobby.push({
        pointValue : 20,
        entryFee : 2000,
        decks : 2,
        noOfSeats : 6,
        gameType : 'points',
        name : 'Point Rummy'
      })



    practicePoolLobby.push({
      type : 101,
      entryFee : 250,
      prize : 500,
      noOfSeats : 2,
      gameType : 'pool',
      name : 'Pool Rummy'
    })

    practicePoolLobby.push({
      type : 101,
      entryFee : 250,
      prize : 1500,
      noOfSeats : 6,
      gameType : 'pool',
      name : 'Pool Rummy'
    })

    practicePoolLobby.push({
      type : 201,
      entryFee : 250,
      prize : 500,
      noOfSeats : 2,
      gameType : 'pool',
      name : 'Pool Rummy'
    })

    practicePoolLobby.push({
      type : 201,
      entryFee : 250,
      prize : 1500,
      noOfSeats : 6,
      gameType : 'pool',
      name : 'Pool Rummy'
    })

    practiceDealsLobby.push({
      deals : 2,
      entryFee : 250,
      prize : 500,
      noOfSeats : 2,
      gameType : 'deals',
      name : 'Deals Rummy'
    })
    practiceDealsLobby.push({
      deals : 6,
      entryFee : 250,
      prize : 1500,
      noOfSeats : 6,
      gameType : 'deals',
      name : 'Deals Rummy'
    })

    let ResObj = {
      practice : {
                points : practicePointsLobby,
                pool : practicePoolLobby,
                deals : practiceDealsLobby
              },
      cashGame :{
        points : pointsJson,
        pool : poolJson,
        deals : dealJson,
        points_21 : points21Json,
        points_24 : points24Json
      },
      tournamnets : {
        points : {},
        pool : {},
        deals : {}
      },
      variant21 : 0,
      variant24 : 0,
      currentVersion :  currentVersion[0].currentVersion,
    };


    res.json(ResObj);
});

router.post('/getAllPromoCodes',Sys.App.Controllers.PromocodeController.getAllPromoCodes);


/**
 * Auth Router
 */
router.get('/',Sys.App.Middlewares.Backend.loginCheck,Sys.App.Controllers.Auth.login);
router.post('/',Sys.App.Middlewares.Backend.loginCheck,Sys.App.Middlewares.Validator.loginPostValidate,Sys.App.Controllers.Auth.postLogin);

router.get('/forgot-password',Sys.App.Controllers.Auth.forgotPassword);
router.post('/forgot-password',Sys.App.Controllers.Auth.forgotPasswordSendMail);
router.get('/reset-password/:token',Sys.App.Controllers.Auth.resetPassword);
router.post('/reset-password/:token',Sys.App.Controllers.Auth.postResetPassword);
router.get('/logout',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.Auth.logout);


router.get('/register',Sys.App.Middlewares.Backend.loginCheck,Sys.App.Controllers.Auth.register);

router.get('/profile',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.Auth.profile);

router.post('/profile/update',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.Auth.profileUpdate);

router.post('/profile/changePwd',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.Auth.ChangePassword);

router.get('/verify-mail/:id',Sys.App.Controllers.PlayerController.verifyEmail);
router.get('/mobileVarify/:id',Sys.App.Controllers.PlayerController.varifyMobile);
router.post('/mobileVarify/:id',Sys.App.Controllers.PlayerController.varifyMobilePost);
router.post('/player/mobileVarifySuccess',Sys.App.Controllers.PlayerController.varifyMobilePost);
router.post('/player/mobileVarifyFailed',Sys.App.Controllers.PlayerController.varifyMobilePost);

/**
 * Dashboard Router
 */
router.get('/dashboard',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.Dashboard.home);

/**
 * User Router
 */
 router.get('/user',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserController.users);
 router.get('/user/getUser',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserController.getUser);

 router.get('/addUser',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserController.addUser);
 // post data can beobtained by req.body.<parameter_name>
 router.post('/addUser',Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Validator.registerUserPostValidate, Sys.App.Controllers.UserController.addUserPostData);
 router.post('/user/getUserDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserController.getUserDelete);

// here mentioned id is fetched as req.params.id
 router.get('/userEdit/:id/',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.UserController.editUser);
 router.post('/userEdit/:id',Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Validator.editUserPostValidate,Sys.App.Controllers.UserController.editUserPostData);

router.get('/test/testing',Sys.App.Middlewares.Backend.loginCheck,Sys.App.Controllers.Auth.login);

/***
  SEO Route
  ------------
****/
router.get('/seo',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.seo);
router.get('/addSeo',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.addSeo);
router.post('/addSeo',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.addSeoPostData);
router.get('/seoEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.seoEdit);
router.post('/seoEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.seoEditPostData);
router.post('/getSeoDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.getSeoDelete);
router.get('/seo/list', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.listSeo);
//router.post('/get-meta-data-details',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SeoController.getSeoDetailsByURL);
/***
  Testimonials Route
  ------------
****/
router.get('/testimonials',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TestimonialController.testimonials);
router.get('/addTestimonials',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TestimonialController.addTestimonials);
router.post('/addTestimonials',Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.TestimonialController.addTestimonialsPostData);
router.get('/testimonialEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TestimonialController.testimonialEdit);
router.post('/testimonialEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TestimonialController.testimonialEditPostData);
router.post('/getTestimonialDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TestimonialController.getTestimonialDelete);
/***
  Blog-Category Route
  ------------
****/
router.get('/blogCategories',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogCategoryController.blogCategories);
router.get('/blogCategories/list', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogCategoryController.listBlogCategories);
router.get('/addBlogCategories',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogCategoryController.addBlogCategories);
router.post('/addBlogCategories',Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.BlogCategoryController.addBlogCategoriesPostData);
router.get('/blogCategoriesEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogCategoryController.blogCategoriesEdit);
router.post('/blogCategoriesEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogCategoryController.blogCategoriesEditPostData);
router.post('/getBlogCategoriesDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogCategoryController.getBlogCategoriesDelete);

/***
  Blog Route
  ------------
****/
router.get('/blog',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogController.blogs);
router.get('/addBlog',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogController.addBlog);
router.post('/addBlog',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogController.addBlogPostData);
router.get('/blogEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogController.blogEdit);
router.post('/blogEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogController.blogEditPostData);
router.post('/getBlogDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.BlogController.getBlogDelete);

/***
  Offers Route
  ------------
****/
router.get('/offers',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OfferController.offers);
router.get('/addOffers',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OfferController.addOffers);
router.post('/addOffers',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OfferController.addOffersPostData);
router.get('/offerEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OfferController.offerEdit);
router.post('/offerEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OfferController.offerEditPostData);
router.post('/getOfferDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OfferController.getOfferDelete);

/***
  Player Route
	------------
****/

router.get('/player',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.player);

router.get('/player/getPlayer',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.getPlayer);
router.get('/player/tdsZero', Sys.App.Controllers.PlayerController.tdsZero);
router.get('/player/pdfgenrate',Sys.App.Controllers.PlayerController.pdfGenrate);
router.get('/player/pdfgenrateList/:id',Sys.App.Controllers.PlayerController.removepdfGenrate);
router.get('/player/pdfgenrateList',Sys.App.Controllers.PlayerController.pdfgenrateList);


router.get('/player/getActivePlayer',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.getActivePlayer);

router.get('/addPlayer',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.addPlayer);

router.post('/addPlayer',Sys.App.Middlewares.Backend.Authenticate, Sys.App.Controllers.PlayerController.addPlayerPostData);

router.get('/playerEdit/:id/',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.editPlayer);

router.post('/playerEdit/:id',Sys.App.Middlewares.Backend.Authenticate, Sys.App.Middlewares.Validator.editPlayerPostValidate,Sys.App.Controllers.PlayerController.editPlayerPostData);

router.post('/player/getPlayerDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.getPlayerDelete);

router.post('/player/active',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.active);

router.post('/player/inActive',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.inActive);

router.post('/player/chipsAdd',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.chipsAdd);

router.post('/player/cashAdd',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.cashAdd);


router.get('/player/chipsHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.chipsHistory);


router.get('/player/getChipsHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.getChipsHistory);

router.get('/player/cashHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.cashHistory);

router.get('/player/getCashHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.getCashHistory);

router.get('/player/loginHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.loginHistory);

router.get('/player/getLoginHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PlayerController.getLoginHistory);
//for web
router.post('/player/chipsAdd_1000',Sys.App.Controllers.PlayerController.chipsAdd_1000);
//for mobile
router.post('/player/chipsNewAdd_1000',Sys.App.Controllers.PlayerController.chipsNewAdd_1000);

/***

	Settings Route

**/

router.post('/settings/add',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Middlewares.Validator.settingsValidation,Sys.App.Controllers.SettingsController.settingsAdd);

router.get('/settings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SettingsController.settings);

router.post('/settings/update',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SettingsController.settingsUpdate);
// router.post('/settings/update',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Middlewares.Validator.settingsValidation,Sys.App.Controllers.SettingsController.settingsUpdate);

router.get('/game-settings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.gameSettings);
router.get('/game-settings-points-21', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.gameSettingsPointsTwentyOne);
router.get('/game-settings-points-24', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.gameSettingsPointsTwentyFour);

router.post('/game/settings/addGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.addGameSettings);
router.post('/game/settings/updateGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.updateGameSettings);

router.post('/game/settings/addPointsGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.addPointsGameSettings);
router.get('/game/settings/getPointsGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.getPointsGameSettings);
router.post('/game/settings/addPoolGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.addPoolGameSettings);
router.get('/game/settings/getPoolGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.getPoolGameSettings);
router.post('/game/settings/addDealGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.addDealGameSettings);
router.get('/game/settings/getDealGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.getDealGameSettings);
router.post('/game/settings/addPointsTwentyOneGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.addPointsTwentyOneGameSettings);
router.post('/game/settings/addPointsTwentyFourGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.addPointsTwentyFourGameSettings);
router.get('/game/settings/getPointsTwentyOneGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.getPointsTwentyOneGameSettings);
router.get('/game/settings/getPointsTwentyFourGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.getPointsTwentyFourGameSettings);
router.post('/game/settings/deleteGameSettings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.gameSettingsController.deleteGameSettings);

/******

	TDS	Settings Route
*******/
router.get('/tds-settings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.tdsSettingsController.tdsSettings);
router.post('/tds-settings/addTdsSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.tdsSettingsController.addTdsSettings);
router.post('/tds-settings/updateTdsSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.tdsSettingsController.updateTdsSettings);


/******

  Disconnection  Settings Route
*******/
router.get('/disconnection-settings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.disconnectionSettingsController.disconnectionSettings);
router.post('/disconnection-settings/addPointsRummyDisconnectionSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.disconnectionSettingsController.addPointsRummyDisconnectionSettings);
//router.post('/tds-settings/updateTdsSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.tdsSettingsController.updateTdsSettings);


/******

	Entry Fees Settings Route
*******/
router.get('/entryFees-settings', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.entryFeesSettingsController.entryFeesSettings);

router.post('/entryFees-settings/addEntryFeesPointsSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.entryFeesSettingsController.addEntryFeesSettings);
router.post('/entryFees-settings/updateEntryFeesPointsSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.entryFeesSettingsController.updateEntryFeesSettings);
router.post('/entryFees-settings/addEntryFeesPointsTwentyOneSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.entryFeesSettingsController.addEntryFeesPoint21Settings);
router.post('/entryFees-settings/updateEntryFeesPointsTwentyOneSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.entryFeesSettingsController.updateEntryFeesPoint21Settings);
router.post('/entryFees-settings/addEntryFeesPointsTwentyFourSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.entryFeesSettingsController.addEntryFeesPoint24Settings);
router.post('/entryFees-settings/updateEntryFeesPointsTwentyFourSettings',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.entryFeesSettingsController.updateEntryFeesPoint24Settings);

/******

		Cash Games

*******/

router.get('/cashgames/stacks',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.StacksController.stacks);

router.get('/cashgames/getStacks',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.StacksController.getStacks);

router.get('/cashgames/addStacks',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.StacksController.addStacks);

router.post('/cashgames/addStacks',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Middlewares.Validator.stacksValidation,Sys.App.Controllers.StacksController.postStacks);

router.post('/cashgames/getStacksDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.StacksController.getStacksDelete);

router.get('/cashgames/stacksEdit/:id/',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.StacksController.editstacks);

router.post('/cashgames/stacksEdit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Middlewares.Validator.stacksValidation,Sys.App.Controllers.StacksController.editStacksPostData);

router.get('/cashgames/texas',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.texas);

router.get('/cashgames/getCashGamePoker/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.getCashGamePoker);

router.post('/cashgames/CashPokerDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.CashPokerDelete);


router.get('/cashgames/omaha',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.omaha);


router.get('/cashgames/texas/gameHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.game);

router.get('/cashgames/texas/gameHistory/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.gameHistory);


router.get('/cashgames/texas/tableHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.tableHistory);

router.get('/cashgames/omaha/gameHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.gameOmaha);


router.get('/cashgames/omaha/getTableHistory/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getGameHistory);

router.get('/cashgames/omaha/tableHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getTableHistoryOmaha);

/**

		Sit & Go Tournament

**/

router.get('/sit-go-tournament/sitGTouSetting',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.settings);

router.post('/sit-go-tournament/sitGTouSettingAdd',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Middlewares.Validator.addSitGoTouValidation,Sys.App.Controllers.RoomController.sitNGosettingPostDataAdd);


router.post('/sit-go-tournament/sitGTouSettingUpdate/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.sitNGosettingPostDataUpdate);


router.get('/sit-go-tournament/texas',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.texasSitGoTour);

router.get('/sit-go-tournament/getCashGamePoker/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.getPokerSitGoTour);

router.post('/sit-go-tournament/CashPokerDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.pokerDeleteSitGoTour);

router.get('/sit-go-tournament/omaha',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.omahaSitGoTour);



router.get('/sit-go-tournament/texas/gameHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.texasGameHistorySitGo);

router.get('/sit-go-tournament/texas/gameHistory/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.gameHistorySitGo);


router.get('/sit-go-tournament/texas/tableHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.tableHistorySitGo);

router.get('/sit-go-tournament/omaha/gameHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.gameHistoryOmahaSitGo);


router.get('/sit-go-tournament/omaha/getTableHistory/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getGameHistorySitGo);

router.get('/sit-go-tournament/omaha/tableHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getTableHistoryOmahaSitGo);

/**

		Regular Tournament

**/

router.get('/regular-tournament/tournament',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.tournament);

router.get('/regular-tournament/addTournament',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.addTournament);

router.post('/regular-tournament/postToAddTournament',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.saveRegularTexasTournament);

router.get('/regular-tournament/getRegularTournament',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.getRegularTournament);

router.post('/regular-tournament/delete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.delete);

router.get('/regular-tournament/editTournament/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.editTournament);

router.post('/regular-tournament/editRegularTournament/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.RoomController.editRegularTournament);


router.get('/regular-tournament/texas',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.texasRegularTou);

router.get('/regular-tournament/getCashGamePoker/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.getPokerRegularTou);

router.post('/regular-tournament/CashPokerDelete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.pokerDeleteRegularTou);

router.get('/regular-tournament/omaha',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TableController.omahaRegularTou);


router.get('/regular-tournament/texas/gameHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.gameRegularTou);

router.get('/regular-tournament/texas/gameHistory/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.gameHistoryRegularTou);


router.get('/regular-tournament/texas/tableHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.tableHistoryRegularTou);

router.get('/regular-tournament/omaha/gameHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.gameOmahaRegularTou);


router.get('/regular-tournament/omaha/getTableHistory/:type/:tableType',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getGameHistoryRegularTou);

router.get('/regular-tournament/omaha/tableHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getTableHistoryOmahaRegularTou);


/**
		Chips History
**/

router.get('/player/chipsHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ChipsHistory.chipsHistory);


router.get('/player/getChipsHistory',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ChipsHistory.getChipsHistory);


/**
		Security List
**/

router.get('/security',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.SecurityController.security);

/**
		Game History -- Added by chetan
**/
router.get('/game/history', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.allGameHistoryLimited);
router.get('/game/activeGame', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.activeGame);
router.get('/game', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.allGameData);
router.get('/game/getGameData', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getAllGameData);
router.get('/game/allGameHistory/:id', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.allGameHistory);

router.get('/game/:gameName/:gameType', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getParticularGameType);
router.get('/game-data/:gameName/:gameType', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.getParticularGameTypeData);
router.get('/game/history/particularGameHistory/:id', Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.GameController.particularGameHistory);
/**
		Game Charts -- Added by chetan
**/
router.get('/dashboard/getMonthlyPlayedGameChart', Sys.App.Controllers.Dashboard.getMonthlyPlayedGameChart);
router.get('/dashboard/getGameUsageChart', Sys.App.Controllers.Dashboard.getGameUsageChart);
//router.get('/dashboard/getDailyLoginChart', Sys.App.Controllers.Dashboard.getDailyLoginChart);
//router.get('/dashboard/getdailyPlayedGameChart', Sys.App.Controllers.Dashboard.getdailyPlayedGameChart);



/**
 * Transaction Routes
 */
 //router.post('/createTransaction',Sys.App.Controllers.TransactController.initiateTransaction);
 router.post('/createTransaction/success',Sys.App.Controllers.TransactController.successTransaction);
 router.post('/createTransaction/failure',Sys.App.Controllers.TransactController.failureTransaction);
 router.get('/transaction/history',  Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TransactController.transactionHistory);
 router.get('/transaction/getHistory',  Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TransactController.getTransactionHistory);
//paytm Transaction

 router.post('/createTransaction',Sys.App.Controllers.TransactController.paymentTransaction);
 router.post('/payment-status',Sys.App.Controllers.TransactController.paymentStatus);

 /**
  * CRON EVENTS
  */
/**
  Other Page
	------------
****/

router.get('/other/menu/:id',Sys.App.Controllers.OtherController.menu);
router.get('/other/account/:id',Sys.App.Controllers.OtherController.account);
router.get('/other/profile/:id',Sys.App.Controllers.OtherController.profile);
router.get('/other/withdrawCash/:id',Sys.App.Controllers.OtherController.withdrawCash);
router.post('/other/postWithdrawCash/:id',Sys.App.Controllers.OtherController.postWithdrawCash);
router.get('/other/transactions/:id',Sys.App.Controllers.OtherController.transactions);
router.get('/other/getTransaction/:type/:id',Sys.App.Controllers.OtherController.getTransaction);
router.post('/other/changeEmail',Sys.App.Controllers.OtherController.changeEmail);
router.post('/other/checkValidMobileNo',Sys.App.Controllers.OtherController.checkValidMobileNo);
router.post('/other/checkOtp',Sys.App.Controllers.OtherController.checkOtp);
router.get('/other/uploadedDocuments/:id',Sys.App.Controllers.OtherController.uploadedDocuments);
router.post('/other/postDocument/:id',Sys.App.Controllers.OtherController.postDocument);
router.get('/other/addBankDetails/:id',Sys.App.Controllers.OtherController.addBankDetails);
router.post('/other/postBankDetails/:id',Sys.App.Controllers.OtherController.bankDetailsPostData);
router.get('/other/uploadHistory/:id',Sys.App.Controllers.OtherController.uploadHistory);
router.post('/other/checkUsername',Sys.App.Controllers.OtherController.checkUsername);
router.get('/other/viewEmail/:id/',Sys.App.Controllers.OtherController.viewEmail);
router.get('/other/addMobile/:id',Sys.App.Controllers.OtherController.addMobile);
router.get('/other/username/:id',Sys.App.Controllers.OtherController.username);
router.get('/other/changePassword/:id',Sys.App.Controllers.OtherController.changePassword);
router.post('/other/changePassword/',Sys.App.Controllers.OtherController.postChangePassword);
// router.get('/other/demo',Sys.App.Controllers.OtherController.demo);
router.get('/forget-password/:id', Sys.App.Controllers.PlayerController.forgetPassword);
router.post('/player/forget-password/:id', Sys.App.Controllers.PlayerController.postForgetPassword);
//player forgot password update 
router.post('/player/forgot-password-update', Sys.App.Controllers.PlayerController.forgotPasswordUpdate);


/**
		Promocode
**/
router.get('/promocode',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.promocode);
router.get('/promocode/getPromocode',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.getPromocode);
router.get('/promocode/add',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.addPromocode);
router.post('/promocode/add',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.addPromocodePostData);
router.post('/promocode/delete',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.deletePromocode);
router.get('/promocode/edit/:id/',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.editPromocode);
router.post('/promocode/edit/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.editPromocodePostData);
router.get('/promocode/history/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.history);
router.get('/promocode/getHistory/:id',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.PromocodeController.getHistory);

/***

	KYC Route

**/
router.get('/kyc-list',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.getPlayersDocsList);
router.get('/kyc-list-approved',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.getPlayersDocsListApproved);
router.get('/other/getKycList',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.getKycList);
router.get('/other/getApprovedKycList',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.getApprovedKycList);
router.post('/other/kyc-list-update',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.updatePlayerKYC);
router.get('/other/withdraw-request',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.withdrawRequest);
router.get('/other/getWithdrawRequestList',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.getWithdrawRequestList);
router.post('/other/withdraw-request-update',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.updatePlayerWithdrawal);
/**
//START:-Pending & Approve Withdraw Request

 */
router.get('/other/other-request',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.otherWithdrawRequest);
router.get('/other/getOtherWithdrawRequestList',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.OtherController.getOtherWithdrawRequestList);
/**
// END:-Pending & Approve Withdraw Request

 */
router.get('/service-charge',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ServiceChargeController.serviceCharge);
router.get('/getCommissionList',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.ServiceChargeController.getCommissionList);

router.get('/tds-charge',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TdsChargeController.tdsCharge);
router.get('/getTdsList',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.TdsChargeController.getTdsList);

router.get('/cron/DeletePracticeTax',Sys.App.Controllers.ServiceChargeController.DeletePracticeTax);

 router.get('/cron/checkPaymentInfo',Sys.App.Controllers.TransactController.checkPaymentInfo);

// Create Dummy User

router.get('/createDummyUser',Sys.App.Middlewares.Backend.Authenticate,Sys.App.Controllers.Dashboard.createDummyUser);


//new API
router.post('/player/add-new-fb-player', Sys.App.Controllers.PlayerController.addNewFBPlayerData);
router.post('/player/add-new-player', Sys.App.Controllers.PlayerController.addNewPlayerData);
//need to check already loggedIn or not pending....
router.post('/player/login',Sys.App.Middlewares.Backend.loginCheck,Sys.App.Controllers.PlayerController.playerLogin);
router.post('/player/loginWithFB',Sys.App.Middlewares.Backend.loginCheck,Sys.App.Controllers.PlayerController.playerLoginWithFB);

//need to add authentication as middleware
router.post('/player/update-profile/:id', Sys.App.Controllers.PlayerController.updatePlayerProfile);
router.get('/player/profile-details/:id', Sys.App.Controllers.PlayerController.getPlayerProfileDetails);
router.post('/player/change-password',Sys.App.Controllers.PlayerController.playerChangePassword);
router.post('/player/forgot-password',Sys.App.Controllers.PlayerController.playerForgotPasswordSendMail);
router.get('/player/account/:id',Sys.App.Controllers.OtherController.playerAccount);
router.get('/player/transaction-history/:id', Sys.App.Controllers.TransactController.getPlayerTransactionHistory);
router.get('/player/tds-charge/:name',Sys.App.Controllers.TdsChargeController.playerTdsCharge);
router.get('/player/document-upload-history/:id',Sys.App.Controllers.OtherController.playerDocuemntUploadHistory);
router.get('/player/cash-history/:id',Sys.App.Controllers.PlayerController.playerCashHistory);
router.get('/player/login-history/:id',Sys.App.Controllers.PlayerController.playerLoginHistory);
router.get('/player/chips-history/:id',Sys.App.Controllers.PlayerController.playerChipsHistory);
router.get('/player/withdraw-history/:id',Sys.App.Controllers.OtherController.playerWithdrawHistory);
router.post('/player/kyc_document_upload',Sys.App.Controllers.OtherController.playerKycDocumentUpload);

//testimonials
router.post('/testimonials/add', Sys.App.Controllers.OtherController.addNewTestimonials);
router.get('/testimonials/list', Sys.App.Controllers.OtherController.listTestimonials);
//blogs
router.post('/blogs/add', Sys.App.Controllers.OtherController.addNewBlogs);
router.get('/blogs/list', Sys.App.Controllers.OtherController.listBlogs);
router.get('/blogs/details/:title', Sys.App.Controllers.OtherController.getBlogDetailsByTitleURL);
router.post('/blogs/edit/:id', Sys.App.Controllers.OtherController.editBlog);

//Game Lobby
router.get('/gamelobby/13CardPointRummy', Sys.App.Controllers.gameSettingsController.get13CardPointRummy);
router.get('/gamelobby/13CardPoolRummy', Sys.App.Controllers.gameSettingsController.get13CardPoolRummy);
router.get('/gamelobby/13CardDealsRummy', Sys.App.Controllers.gameSettingsController.get13CardDealsRummy);
router.get('/gamelobby/21CardPointRummy', Sys.App.Controllers.gameSettingsController.get21CardPointRummy);
router.get('/gamelobby/24CardPointRummy', Sys.App.Controllers.gameSettingsController.get24CardPointRummy);
//club status
router.post('/player/clubstatus', Sys.App.Controllers.PlayerController.updatePlayerClubStatus);
//offer
router.get('/offers/list', Sys.App.Controllers.OtherController.listOffers);
router.get('/offers/details/:id', Sys.App.Controllers.OtherController.getOfferDetails);
router.post('/offers/edit/:id', Sys.App.Controllers.OtherController.editOffer);
router.post('/offers/update/:id', Sys.App.Controllers.OtherController.updateOffer);
router.post('/get-meta-data-details', Sys.App.Controllers.SeoController.getSeoDetailsByURL);
router.get('/disconnection_settings', Sys.App.Controllers.PlayerController.disconnection_settings);
router.get('/disconnection_settings/:id', Sys.App.Controllers.PlayerController.getDisconnectionSettings);
router.post('/disconnection_settings_update/:id', Sys.App.Controllers.PlayerController.updateDisconnectionSettings);

//Account Overview
router.get('/account/menu/:id',Sys.App.Controllers.OtherController.accountMenu);
router.get('/account/overview/:id',Sys.App.Controllers.OtherController.accountOverview);
router.get('/account/profile/:id',Sys.App.Controllers.OtherController.accountProfile);
router.post('/account/change-profile',Sys.App.Controllers.OtherController.accountChangeProfile);
router.post('/account/changePassword/',Sys.App.Controllers.OtherController.accountChangePassword);
router.post('/account/WithdrawCash/:id',Sys.App.Controllers.OtherController.accountWithdrawCash);
router.post('/account/AddBankDetails/:id',Sys.App.Controllers.OtherController.accountAddBankDetails);
router.get('/account/viewKycDocumentHistory/:id',Sys.App.Controllers.OtherController.accountViewKycDocumentHistory);
router.post('/account/uploadKycDocument',Sys.App.Controllers.OtherController.playerKycDocumentUpload);
router.post('/player/cashDetailsByLessThanDate',Sys.App.Controllers.OtherController.cashDetailsByLessThanDate);

module.exports = router
