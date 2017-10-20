var express = require("express");
var router  = express.Router();
var Partner = require("../models/partner");
var middleware = require("../middleware");


//INDEX - show all partners
router.get("/", function(req, res){
    // Get all partners from DB
    Partner.find({}, function(err, allPartners){
       if(err){
           console.log(err);
       } else {
          res.render("partners/index",{partners:allPartners});
       }
    });
});

//CREATE - add new partner to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to partners array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPartner = {name: name, image: image, description: desc, author:author}
    // Create a new partner and save to DB
    Partner.create(newPartner, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to partners page
            console.log(newlyCreated);
            res.redirect("/partners");
        }
    });
});

//NEW - show form to create new partner
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("partners/new"); 
});

// SHOW - shows more info about one partner
router.get("/:id", function(req, res){
    //find the partner with provided ID
    Partner.findById(req.params.id).populate("comments").exec(function(err, foundPartner){
        if(err){
            console.log(err);
        } else {
            console.log(foundPartner)
            //render show template with that partner
            res.render("partners/show", {partner: foundPartner});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkPartnerOwnership, function(req, res){
    Partner.findById(req.params.id, function(err, foundPartner){
        res.render("partners/edit", {partner: foundPartner});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkPartnerOwnership, function(req, res){
    // find and update the correct partner
    Partner.findByIdAndUpdate(req.params.id, req.body.partner, function(err, updatedPartner){
       if(err){
           res.redirect("/partners");
       } else {
           //redirect somewhere(show page)
           res.redirect("/partners/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkPartnerOwnership, function(req, res){
   Partner.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/partners");
      } else {
          res.redirect("/partners");
      }
   });
});


module.exports = router;

