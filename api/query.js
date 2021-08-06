const config = require('../config/databaseConfig');

var contactFetchQuery = "select cts.id, usr.firstname ownerFirstName, usr.lastname ownerLastName, cts.firstname, cts.lastname, "+
"cts.email, cts.address, cts.city, cts.state, cts.zip, cts.birthday"+
", cts.date, cts.status, cts.priority, cts.home_phone, cts.sms_number, cts.dla, cts.contact_cat, cts.bulk_mail, cts.bulk_sms, cts.office_phone, cts.fax, cts.dlm, "+
"cts.company, cts.address2, cts.title, cts.website, cts.country, cts.system_source, cts.source_location, cts.import_id, cts.ip_addy, cts.ip_addy_display, "+
"cts.freferrer, cts.lreferrer, cts.n_lead_source, cts.n_content, cts.n_term, cts.n_media, cts.n_medium, cts.n_campaign, cts.l_lead_source, cts.l_content, "+
"cts.l_term, cts.l_medium, cts.l_campaign, cts.referral_page, cts.aff_sales, cts.aff_amount, cts.program_id, cts.aff_paypal, cts.fb_gender, cts.mrcAmount, "+
"cts.mrcUnpaid, cts.mriInvoiceNum, cts.mriInvoiceTotal, cts.ccType, cts.ccExpirationMonth, cts.ccExpirationYear, cts.ccExpirationDate, "+
"cts.ccNumber, cts.mrcResult, cts.bindex, cts.last_inbound_sms, cts.timezone, cts.time_since_dla, cts.facebook_link, cts.twitter_link, "+
"cts.instagram_link, cts.linkedin_link, cts.profile_image, cts.gcid, cts.gclid, cts.fbc, cts.fbp, cts.user_agent, cts.spent, "+
"cts.num_purchased, cts.unpaid_invoices, cts.has_membership, cts.unique_id "+
" from "+config.database+".contacts cts left JOIN "+config.database+".users usr ON cts.owner=usr.id;";

