define([
], function(d3){
	// Javascript to test an IPv6 address for proper format, and to 
	// present the "best text representation" according to IETF Draft RFC at
	// http://tools.ietf.org/html/draft-ietf-6man-text-addr-representation-04

	// 8 Feb 2010 Rich Brown, Dartware, LLC

	// LICENSE
	//
	// IPv6 Validator by Dartware, LLC is licensed under a 
	// Creative Commons Attribution-ShareAlike 3.0 Unported License.
	// http://creativecommons.org/licenses/by-sa/3.0/
	// 
	// Please mention Dartware and provide a link back to our site
	// in the documentation with other attributions. It should say,
	// 
	// ---
	// IPv6 Validator courtesy of Dartware, LLC (http://intermapper.com)
	// For full details see http://intermapper.com/ipv6validator
	// ---


	// do the work of checking the string
	var IPv6Validator = function(){

	};

	IPv6Validator.prototype.checkipv6 = function(str) {
		var perlipv6regex = "^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$";
		var aeronipv6regex = "^\s*((?=.*::.*)(::)?([0-9A-F]{1,4}(:(?=[0-9A-F])|(?!\2)(?!\5)(::)|\z)){0,7}|((?=.*::.*)(::)?([0-9A-F]{1,4}(:(?=[0-9A-F])|(?!\7)(?!\10)(::))){0,5}|([0-9A-F]{1,4}:){6})((25[0-5]|(2[0-4]|1[0-9]|[1-9]?)[0-9])(\.(?=.)|\z)){4}|([0-9A-F]{1,4}:){7}[0-9A-F]{1,4})\s*$";
		var foxipv6regex = "^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*(/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$";

		var regex = new RegExp(foxipv6regex);
		return (regex.test(str));
	};

	IPv6Validator.prototype.formatipv6field = function(str) {
		var str, str1, theAddress;
		
		var pageItem = document.getElementById('ipv6text');			// retrieve the user's input field
		theAddress = pageItem.value;
		
		str = this.formatipv6result(theAddress);							// retrieve the Good/Bad result string
	//	str = str + "1";				// retrieve the best representation
		pageItem = document.getElementById('ipv6results');
		pageItem.innerHTML = str;									// and display it

	//	pageItem = document.getElementById('bestrepresentation');	
	//	pageItem.innerHTML = str;									// and display it
	};

	// Print Good/Bad IPv6 Result
	IPv6Validator.prototype.formatipv6result = function(str) {
	var resultstr = "";
	var str1;
	var font =  'font-family:Arial, Verdana, Sans-serif;font-size:16px;';
	var styling = '<span style="color:%s;' + font + '">%s</span>';
	var color = "";

		if (this.checkipv6(str))
		{	
			color = '#000000';
			resultstr = "Valid IPv6 Format. Best representation is ";
			str1 = this.formatbestipv6(str);
			resultstr = resultstr + str1;
		} 
		else 
		{
			resultstr = "Invalid IPv6 format";
			color = '#FF0000';
		}
		resultstr =  this.sprintf(styling ,color, resultstr);

	return resultstr;
	};

	// Global variables - Danger Will Robinson!
	//	"segments" holds the segments of the IPv6 address
	//	"totalsegments" holds number of segments
	//  "debugstr" holds assorted debugging information, normally ""

	var segments;		// the global array to hold the segments
	var totalsegments;	// assumed to be 8 unless the last is a IPv4 address, then seven
	var debugstr = "";	// a place to put debugging information

	// print the "preferred representation" of the IPv6 address
	IPv6Validator.prototype.formatipv6preferred = function(theaddress) {
		var resultstr = "";
		var beststr = "";
			
		beststr = this.formatbestipv6(theaddress);		

		resultstr = resultstr + "<br /> Best representation: " + beststr;
		if (debugstr.length > 0)
			{ resultstr = resultstr + "<br />" + debugstr; }

		return resultstr;
	};

	IPv6Validator.prototype.formatbestipv6 = function(theaddress) {
		var str;
		var beststr = "Not valid IPv6 Address";
		
		if (this.checkipv6(theaddress))
		{	
			// ASSERT: theaddress is a well-formed IPv6 address, as a result of the this.checkipv6() call
			// Make the string lowercase and split it up on the ":"
			str = theaddress.toLowerCase();
			segments = str.split(":");
			
			// Trim off leading or trailing double-"" from front or back (:: or ::a:b:c... or a:b:c::)
			this.trimcolonsfromends();
			// ASSERT: at this point segments[] has exactly zero or one "" string in it
		
			// Check for IPv4 in the final segment. This affects the total number of segment expected; 
			// If IPv4 is present, then only 7 segments; otherwise there'll be 8
			totalsegments = this.adjustsegmentsforipv4();
			
			// Fill in empty segments
			// Scan to see if there are any empty segments (resulting from "::")
			// fill them with "0000"
			this.fillemptysegments();
			// ASSERT: There are exactly *totalsegments* segments, with original (non-empty) entry, or "0000"
		
			// Now strip off leading zero's from all entries
			this.stripleadingzeroes();
			// ASSERT: at this point, all leading zeroes have been stripped off
		
			// Scan through looking for consecutive "0" segments
			this.removeconsecutivezeroes();
			
			// debugstr = debugstr + "-----<br />" + this.printsegments();
			
			// Assemble best representation from remainder of segments
			beststr = this.assemblebestrepresentation();
		}
		return beststr;
	};

	// printsegments - return each of the actual segments, one per line for debugging. 
	IPv6Validator.prototype.printsegments = function() {
		var resultstr = "";
		for (i=0;i<segments.length; i++)
	 	{
	 		resultstr = resultstr + i.toString() + ' "' + segments[i] + '"<br />';
	 	}
		return resultstr;
	};

	// Trim off leading or trailing double-"" from front or back (:: or ::a:b:c... or a:b:c::)
	IPv6Validator.prototype.trimcolonsfromends = function() {
		var seglen = segments.length;
		if ((segments[0] == '') && (segments[1] == '') && (segments[2] == "")) // must have been ::
			{ segments.shift(); segments.shift() }							//    remove first two items
		else if ((segments[0] == '') && (segments[1] == ''))				// must have been ::xxxx
			{ segments.shift(); }											//    remove the first item
		else if ((segments[seglen-1] == '') && (segments[seglen-2] == '')) 	// must have been xxxx::
			{ segments.pop(); }												//    remove the last item	
		// ASSERT: at this point segments[] has exactly zero or one "" string in it
	};

	// adjust number of segments - if IPv4 address present, there really are only seven segments
	IPv6Validator.prototype.adjustsegmentsforipv4 = function() {
		var numsegments = 8;
		if (segments[segments.length-1].indexOf(".") != -1)                  // found a "." which means IPv4
		{
			// alert ("only seven segments");
			numsegments = 7;
		}
		return numsegments;
	};

	// fillemptysegments - find all the empty segments and fill them with "0000"
	IPv6Validator.prototype.fillemptysegments = function() {
		var pos;
		for (pos=0; pos<segments.length; pos++)								// scan to find position of the ""
		{
			if (segments[pos] == '') { break; }
		}
		// alert(pos.toString());
		
		// Now splice in enough "0000" entries in the array to flesh it out to totalsegments entries

		if (pos < totalsegments)
		{
			segments.splice(pos, 1, "0000");				// Replace the "" with "0000"
			while (segments.length < totalsegments)			// if it's not long enough
			{
				segments.splice(pos, 0, "0000");			// insert one more "0000"
			}
		}
	};

	// strip leading zeroes from every segment
	IPv6Validator.prototype.stripleadingzeroes = function() {
		var segs;
		for (i=0; i<totalsegments; i++)						// for each of the segments
		{
			segs=segments[i].split("");						// split the segment apart
			for (j=0; j<3 ; j++)							// scan through at most three characters 
			{
				// alert(segs);
				if ((segs[0] == "0") && (segs.length > 1))	// if leading zero and not last character
					segs.splice(0,1);						//    take it out
				else break;									// non-zero or last character - break out
			}
			segments[i] = segs.join("");					// put 'em back together
		}
	};

	// find longest sequence of zeroes and coalesce them into one segment
	IPv6Validator.prototype.removeconsecutivezeroes = function() {
			var bestpos = -1;									// bestpos contains position of longest sequence
			var bestcnt = 0;									// bestcnt contains the number of occurrences
			var inzeroes = false;								// assume we start in zeroes
			var curcnt = 0;
			var curpos = -1;
			var i;
			
			for (i=0; i<totalsegments; i++)
			{
				// alert (i.toString() + " " + inzeroes.toString() + " " + bestpos.toString() + " " + bestcnt.toString() + " ");
				if (inzeroes)									// we're in a run of zero segments
				{
					if (segments[i] == "0")						// one more - just count it
						curcnt += 1;
					else										// found the end of it
					{
						inzeroes = false;						// not in zeroes anymore
						if (curcnt > bestcnt)
							{ bestpos = curpos; bestcnt = curcnt; } // remember this place & count
					}
				}
				else											// not in a run of zeroes
				{
					if (segments[i] == "0")						// found one!
						{ inzeroes = true; curpos = i; curcnt = 1; }
				}
			}
			if (curcnt > bestcnt)
				{ bestpos = curpos; bestcnt = curcnt; } // remember this place & count

			//debugstr = 'bestpos: ' + bestpos.toString() + ' bestcnt: ' + bestcnt.toString() + '<br />';
			//debugstr = resultstr + this.printsegments();		// 
			
			// now take out runs of zeroes that are longer than one occurrance
			if (bestcnt > 1)
			{
				segments.splice(bestpos, bestcnt, "");
			}
	};

	// Assemble best representation of the string
	IPv6Validator.prototype.assemblebestrepresentation = function() {
		var beststr = "";
		var segslen = segments.length;
		if (segments[0] == "") 
			beststr = ":";
		for (i=0; i<segslen; i++)
		{
			beststr = beststr + segments[i];
			if (i == segslen-1) break;
			beststr = beststr + ":";
		}
		if (segments[segslen-1] == "")
			beststr = beststr + ":";
		return beststr;
	};

	// This function clears the field when a customer focuses on it
	//   unless the field doesn't contain the default "Enter acknowedge text"
	IPv6Validator.prototype.focus_field = function(obj) {
	obj.style.color='';
	obj.style.fontStyle='';
	if (obj.value=="::1")
		{
		obj.value='';
		}
	};

	// function from http://forums.devshed.com/t39065/s84ded709f924610aa44fff827511aba3.html
	// author appears to be Robert Pollard
	// found on: http://www.esqsoft.com/javascript_examples/javascript-sprintf.js

	IPv6Validator.prototype.sprintf = function() {
	   if (!arguments || arguments.length < 1 || !RegExp)
	   {
	      return;
	   }
	   var str = arguments[0];
	   var re = /([^%]*)%('.|0|\x20)?(-)?(\d+)?(\.\d+)?(%|b|c|d|u|f|o|s|x|X)(.*)/;
	   var a = b = [], numSubstitutions = 0, numMatches = 0;
	   while (a = re.exec(str))
	   {
	      var leftpart = a[1], pPad = a[2], pJustify = a[3], pMinLength = a[4];
	      var pPrecision = a[5], pType = a[6], rightPart = a[7];

	      numMatches++;
	      if (pType == '%')
	      {
	         subst = '%';
	      }
	      else
	      {
	         numSubstitutions++;
	         if (numSubstitutions >= arguments.length)
	         {
	            alert('Error! Not enough function arguments (' + (arguments.length - 1)
	               + ', excluding the string)\n'
	               + 'for the number of substitution parameters in string ('
	               + numSubstitutions + ' so far).');
	         }
	         var param = arguments[numSubstitutions];
	         var pad = '';
	                if (pPad && pPad.substr(0,1) == "'") pad = leftpart.substr(1,1);
	           else if (pPad) pad = pPad;
	         var justifyRight = true;
	                if (pJustify && pJustify === "-") justifyRight = false;
	         var minLength = -1;
	                if (pMinLength) minLength = parseInt(pMinLength);
	         var precision = -1;
	                if (pPrecision && pType == 'f')
	                   precision = parseInt(pPrecision.substring(1));
	         var subst = param;
	         switch (pType)
	         {
	         case 'b':
	            subst = parseInt(param).toString(2);
	            break;
	         case 'c':
	            subst = String.fromCharCode(parseInt(param));
	            break;
	         case 'd':
	            subst = parseInt(param) ? parseInt(param) : 0;
	            break;
	         case 'u':
	            subst = Math.abs(param);
	            break;
	         case 'f':
	            subst = (precision > -1)
	             ? Math.round(parseFloat(param) * Math.pow(10, precision))
	              / Math.pow(10, precision)
	             : parseFloat(param);
	            break;
	         case 'o':
	            subst = parseInt(param).toString(8);
	            break;
	         case 's':
	            subst = param;
	            break;
	         case 'x':
	            subst = ('' + parseInt(param).toString(16)).toLowerCase();
	            break;
	         case 'X':
	            subst = ('' + parseInt(param).toString(16)).toUpperCase();
	            break;
	         }
	         var padLeft = minLength - subst.toString().length;
	         if (padLeft > 0)
	         {
	            var arrTmp = new Array(padLeft+1);
	            var padding = arrTmp.join(pad?pad:" ");
	         }
	         else
	         {
	            var padding = "";
	         }
	      }
	      str = leftpart + padding + subst + rightPart;
	   }
	   return str;
	};
	 
	IPv6Validator.prototype.XTEST = function(sbok, str, beststr)  {
	 	var bestrep;
	 	var lcstr;
	 	
	 	return; 					// Just return for production - too slow
	 	if (this.checkipv6(str) && sbok) 
	 	{
	 		// it's OK - both return true
	 	}
	 	else if (!this.checkipv6(str) && !sbok)
	 	{
	 		// this is OK, too
	 	}
	 	else
	 	{
	 		alert (str + " is not OK");
	 	}
	 	
	 	// Check the best representation, as well
	 	
	 	bestrep = this.formatbestipv6(str);	// get the best representation
	 	lcstr = beststr.toLowerCase();	// the lower-case representation of the test case
	 	if (sbok && (lcstr != bestrep))	// if it should be well formatted, is it correct?
	 	{
	 		debugstr = debugstr + "<br />'" + lcstr + "'<br />'" + bestrep + "'<br />";
	 	}
	 };
	 
	IPv6Validator.prototype.checkall = function() {
	 	//this.formatipv6field();
		this.XTEST(false,"","---");
		this.XTEST(true ,"2001:0000:1234:0000:0000:C1C0:ABCD:0876","2001:0:1234::C1C0:ABCD:876"); 
		this.XTEST(true ,"3ffe:0b00:0000:0000:0001:0000:0000:000a","3ffe:b00::1:0:0:a"); 
		this.XTEST(true ,"FF02:0000:0000:0000:0000:0000:0000:0001","FF02::1"); 
		this.XTEST(true ,"0000:0000:0000:0000:0000:0000:0000:0001","::1"); 
		this.XTEST(true ,"0000:0000:0000:0000:0000:0000:0000:0000","::"); 
		this.XTEST(true ,"::ffff:192.168.1.26","::ffff:192.168.1.26"); 
		this.XTEST(false,"02001:0000:1234:0000:0000:C1C0:ABCD:0876","---");      
		this.XTEST(false,"2001:0000:1234:0000:00001:C1C0:ABCD:0876","---");     
		this.XTEST(true ," 2001:0000:1234:0000:0000:C1C0:ABCD:0876"," 2001:0:1234::C1C0:ABCD:876"); 
		this.XTEST(true ," 2001:0000:1234:0000:0000:C1C0:ABCD:0876  "," 2001:0:1234::C1C0:ABCD:876  "); 
		this.XTEST(false," 2001:0000:1234:0000:0000:C1C0:ABCD:0876  0","---"); 
		this.XTEST(false,"2001:0000:1234: 0000:0000:C1C0:ABCD:0876","---"); 
		this.XTEST(false,"2001:1:1:1:1:1:255Z255X255Y255","---");
		
		this.XTEST(false,"3ffe:0b00:0000:0001:0000:0000:000a","---"); 
		this.XTEST(false,"FF02:0000:0000:0000:0000:0000:0000:0000:0001","---"); 
		this.XTEST(false,"3ffe:b00::1::a","---"); 
		this.XTEST(false,"::1111:2222:3333:4444:5555:6666::","---");       
		this.XTEST(true ,"2::10","2::10"); 
		this.XTEST(true ,"ff02::1","ff02::1"); 
		this.XTEST(true ,"fe80::","fe80::"); 
		this.XTEST(true ,"2002::","2002::"); 
		this.XTEST(true ,"2001:db8::","2001:db8::"); 
		this.XTEST(true ,"2001:0db8:1234::","2001:db8:1234::"); 
		this.XTEST(true ,"::ffff:0:0","::ffff:0:0"); 
		this.XTEST(true ,"::1","::1"); 
		this.XTEST(true ,"::ffff:192.168.1.1","::ffff:192.168.1.1"); 
		this.XTEST(true ,"1:2:3:4:5:6:7:8","1:2:3:4:5:6:7:8"); 
		this.XTEST(true ,"1:2:3:4:5:6::8","1:2:3:4:5:6:0:8"); 
		this.XTEST(true ,"1:2:3:4:5::8","1:2:3:4:5::8"); 
		this.XTEST(true ,"1:2:3:4::8","1:2:3:4::8"); 
		this.XTEST(true ,"1:2:3::8","1:2:3::8"); 
		this.XTEST(true ,"1:2::8","1:2::8"); 
		this.XTEST(true ,"1::8","1::8"); 
		this.XTEST(true ,"1::2:3:4:5:6:7","1:0:2:3:4:5:6:7"); 
		this.XTEST(true ,"1::2:3:4:5:6","1::2:3:4:5:6"); 
		this.XTEST(true ,"1::2:3:4:5","1::2:3:4:5"); 
		this.XTEST(true ,"1::2:3:4","1::2:3:4"); 
		this.XTEST(true ,"1::2:3","1::2:3"); 
		this.XTEST(true ,"1::8","1::8"); 
		this.XTEST(true ,"::2:3:4:5:6:7:8","0:2:3:4:5:6:7:8"); 
		this.XTEST(true ,"::2:3:4:5:6:7","::2:3:4:5:6:7"); 
		this.XTEST(true ,"::2:3:4:5:6","::2:3:4:5:6"); 
		this.XTEST(true ,"::2:3:4:5","::2:3:4:5"); 
		this.XTEST(true ,"::2:3:4","::2:3:4"); 
		this.XTEST(true ,"::2:3","::2:3"); 
		this.XTEST(true ,"::8","::8"); 
		this.XTEST(true ,"1:2:3:4:5:6::","1:2:3:4:5:6::"); 
		this.XTEST(true ,"1:2:3:4:5::","1:2:3:4:5::"); 
		this.XTEST(true ,"1:2:3:4::","1:2:3:4::"); 
		this.XTEST(true ,"1:2:3::","1:2:3::"); 
		this.XTEST(true ,"1:2::","1:2::"); 
		this.XTEST(true ,"1::","1::"); 
		this.XTEST(true ,"1:2:3:4:5::7:8","1:2:3:4:5:0:7:8"); 
		this.XTEST(false,"1:2:3::4:5::7:8","---"); 
		this.XTEST(false,"12345::6:7:8","---"); 
		this.XTEST(true ,"1:2:3:4::7:8","1:2:3:4::7:8"); 
		this.XTEST(true ,"1:2:3::7:8","1:2:3::7:8"); 
		this.XTEST(true ,"1:2::7:8","1:2::7:8"); 
		this.XTEST(true ,"1::7:8","1::7:8"); 
		this.XTEST(true ,"1:2:3:4:5:6:1.2.3.4","1:2:3:4:5:6:1.2.3.4"); 
		this.XTEST(true ,"1:2:3:4:5::1.2.3.4","1:2:3:4:5:0:1.2.3.4"); 
		this.XTEST(true ,"1:2:3:4::1.2.3.4","1:2:3:4::1.2.3.4"); 
		this.XTEST(true ,"1:2:3::1.2.3.4","1:2:3::1.2.3.4"); 
		this.XTEST(true ,"1:2::1.2.3.4","1:2::1.2.3.4"); 
		this.XTEST(true ,"1::1.2.3.4","1::1.2.3.4"); 
		this.XTEST(true ,"1:2:3:4::5:1.2.3.4","1:2:3:4:0:5:1.2.3.4"); 
		this.XTEST(true ,"1:2:3::5:1.2.3.4","1:2:3::5:1.2.3.4"); 
		this.XTEST(true ,"1:2::5:1.2.3.4","1:2::5:1.2.3.4"); 
		this.XTEST(true ,"1::5:1.2.3.4","1::5:1.2.3.4"); 
		this.XTEST(true ,"1::5:11.22.33.44","1::5:11.22.33.44"); 
		this.XTEST(false,"1::5:400.2.3.4","---"); 
		this.XTEST(false,"1::5:260.2.3.4","---"); 
		this.XTEST(false,"1::5:256.2.3.4","---"); 
		this.XTEST(false,"1::5:1.256.3.4","---"); 
		this.XTEST(false,"1::5:1.2.256.4","---"); 
		this.XTEST(false,"1::5:1.2.3.256","---"); 
		this.XTEST(false,"1::5:300.2.3.4","---"); 
		this.XTEST(false,"1::5:1.300.3.4","---"); 
		this.XTEST(false,"1::5:1.2.300.4","---"); 
		this.XTEST(false,"1::5:1.2.3.300","---"); 
		this.XTEST(false,"1::5:900.2.3.4","---"); 
		this.XTEST(false,"1::5:1.900.3.4","---"); 
		this.XTEST(false,"1::5:1.2.900.4","---"); 
		this.XTEST(false,"1::5:1.2.3.900","---"); 
		this.XTEST(false,"1::5:300.300.300.300","---"); 
		this.XTEST(false,"1::5:3000.30.30.30","---"); 
		this.XTEST(false,"1::400.2.3.4","---"); 
		this.XTEST(false,"1::260.2.3.4","---"); 
		this.XTEST(false,"1::256.2.3.4","---"); 
		this.XTEST(false,"1::1.256.3.4","---"); 
		this.XTEST(false,"1::1.2.256.4","---"); 
		this.XTEST(false,"1::1.2.3.256","---"); 
		this.XTEST(false,"1::300.2.3.4","---"); 
		this.XTEST(false,"1::1.300.3.4","---"); 
		this.XTEST(false,"1::1.2.300.4","---"); 
		this.XTEST(false,"1::1.2.3.300","---"); 
		this.XTEST(false,"1::900.2.3.4","---"); 
		this.XTEST(false,"1::1.900.3.4","---"); 
		this.XTEST(false,"1::1.2.900.4","---"); 
		this.XTEST(false,"1::1.2.3.900","---"); 
		this.XTEST(false,"1::300.300.300.300","---"); 
		this.XTEST(false,"1::3000.30.30.30","---"); 
		this.XTEST(false,"::400.2.3.4","---"); 
		this.XTEST(false,"::260.2.3.4","---"); 
		this.XTEST(false,"::256.2.3.4","---"); 
		this.XTEST(false,"::1.256.3.4","---"); 
		this.XTEST(false,"::1.2.256.4","---"); 
		this.XTEST(false,"::1.2.3.256","---"); 
		this.XTEST(false,"::300.2.3.4","---"); 
		this.XTEST(false,"::1.300.3.4","---"); 
		this.XTEST(false,"::1.2.300.4","---"); 
		this.XTEST(false,"::1.2.3.300","---"); 
		this.XTEST(false,"::900.2.3.4","---"); 
		this.XTEST(false,"::1.900.3.4","---"); 
		this.XTEST(false,"::1.2.900.4","---"); 
		this.XTEST(false,"::1.2.3.900","---"); 
		this.XTEST(false,"::300.300.300.300","---"); 
		this.XTEST(false,"::3000.30.30.30","---"); 
		this.XTEST(true ,"fe80::217:f2ff:254.7.237.98","fe80::217:f2ff:254.7.237.98"); 
		this.XTEST(true ,"fe80::217:f2ff:fe07:ed62","fe80::217:f2ff:fe07:ed62"); 
		this.XTEST(true ,"2001:DB8:0:0:8:800:200C:417A","2001:DB8::8:800:200C:417A"); 
		this.XTEST(true ,"FF01:0:0:0:0:0:0:101","FF01::101"); 
		this.XTEST(true ,"0:0:0:0:0:0:0:1","::1"); 
		this.XTEST(true ,"0:0:0:0:0:0:0:0","::"); 
		this.XTEST(true ,"2001:DB8::8:800:200C:417A","2001:DB8::8:800:200C:417A"); 
		this.XTEST(true ,"FF01::101","FF01::101"); 
		this.XTEST(true ,"::1","::1"); 
		this.XTEST(true ,"::","::"); 
		this.XTEST(true ,"0:0:0:0:0:0:13.1.68.3","::13.1.68.3"); 
		this.XTEST(true ,"0:0:0:0:0:FFFF:129.144.52.38","::FFFF:129.144.52.38");
		this.XTEST(true ,"::13.1.68.3","::13.1.68.3"); 
		this.XTEST(true ,"::FFFF:129.144.52.38","::FFFF:129.144.52.38"); 
	// 	# this.XTEST(true ,"2001:0DB8:0000:CD30:0000:0000:0000:0000/60","2001:0DB8:0000:CD30:0000:0000:0000:0000/60");
	// 	# this.XTEST(true ,"2001:0DB8::CD30:0:0:0:0/60","2001:0DB8::CD30:0:0:0:0/60");
	// 	# this.XTEST(true ,"2001:0DB8:0:CD30::/60","2001:0DB8:0:CD30::/60");
	// 	# this.XTEST(true ,"::/128","::/128"); 
	// 	# this.XTEST(true ,"::1/128","::1/128"); 
	// 	# this.XTEST(true ,"FF00::/8","FF00::/8"); 
	// 	# this.XTEST(true ,"FE80::/10","FE80::/10"); 
	// 	# this.XTEST(true ,"FEC0::/10","FEC0::/10"); 
	// 	# this.XTEST(false,"124.15.6.89/60","---"); 
		this.XTEST(false,"2001:DB8:0:0:8:800:200C:417A:221","---"); 
		this.XTEST(false,"FF01::101::2","---");
		this.XTEST(false,"","---"); 
		
		this.XTEST(true ,"fe80:0000:0000:0000:0204:61ff:fe9d:f156","fe80::204:61ff:fe9d:f156"); 
		this.XTEST(true ,"fe80:0:0:0:204:61ff:fe9d:f156","fe80::204:61ff:fe9d:f156"); 
		this.XTEST(true ,"fe80::204:61ff:fe9d:f156","fe80::204:61ff:fe9d:f156"); 
		this.XTEST(false,"fe80:0000:0000:0000:0204:61ff:254.157.241.086","---"); 
		this.XTEST(true ,"fe80:0:0:0:204:61ff:254.157.241.86","fe80::204:61ff:254.157.241.86"); 
		this.XTEST(true ,"fe80::204:61ff:254.157.241.86","fe80::204:61ff:254.157.241.86"); 
		this.XTEST(true ,"::1","::1"); 
		this.XTEST(true ,"fe80::","fe80::"); 
		this.XTEST(true ,"fe80::1","fe80::1"); 
		this.XTEST(false,":","---");

	// Aeron supplied these test cases.	
		this.XTEST(false,"1111:2222:3333:4444::5555:","---");
		this.XTEST(false,"1111:2222:3333::5555:","---");
		this.XTEST(false,"1111:2222::5555:","---");
		this.XTEST(false,"1111::5555:","---");
		this.XTEST(false,"::5555:","---");
		this.XTEST(false,":::","---");
		this.XTEST(false,"1111:","---");
		this.XTEST(false,":","---");
		
		this.XTEST(false,":1111:2222:3333:4444::5555","---");
		this.XTEST(false,":1111:2222:3333::5555","---");
		this.XTEST(false,":1111:2222::5555","---");
		this.XTEST(false,":1111::5555","---");
		this.XTEST(false,":::5555","---");
		this.XTEST(false,":::","---");
		
		this.XTEST(false,"1.2.3.4:1111:2222:3333:4444::5555","---");
		this.XTEST(false,"1.2.3.4:1111:2222:3333::5555","---");
		this.XTEST(false,"1.2.3.4:1111:2222::5555","---");
		this.XTEST(false,"1.2.3.4:1111::5555","---");
		this.XTEST(false,"1.2.3.4::5555","---");
		this.XTEST(false,"1.2.3.4::","---");

	// Additional Patterns
	// from http://rt.cpan.org/Public/Bug/Display.html?id=50693

		this.XTEST(true ,"2001:0db8:85a3:0000:0000:8a2e:0370:7334","2001:db8:85a3::8a2e:370:7334");
		this.XTEST(true ,"2001:db8:85a3:0:0:8a2e:370:7334","2001:db8:85a3::8a2e:370:7334");
		this.XTEST(true ,"2001:db8:85a3::8a2e:370:7334","2001:db8:85a3::8a2e:370:7334");
		this.XTEST(true ,"2001:0db8:0000:0000:0000:0000:1428:57ab","2001:db8::1428:57ab");
		this.XTEST(true ,"2001:0db8:0000:0000:0000::1428:57ab","2001:db8::1428:57ab");
		this.XTEST(true ,"2001:0db8:0:0:0:0:1428:57ab","2001:db8::1428:57ab");
		this.XTEST(true ,"2001:0db8:0:0::1428:57ab","2001:db8::1428:57ab");
		this.XTEST(true ,"2001:0db8::1428:57ab","2001:db8::1428:57ab");
		this.XTEST(true ,"2001:db8::1428:57ab","2001:db8::1428:57ab");
		this.XTEST(true ,"0000:0000:0000:0000:0000:0000:0000:0001","::1");
		this.XTEST(true ,"::1","::1");
		this.XTEST(true ,"::ffff:12.34.56.78","::ffff:12.34.56.78");
		this.XTEST(true ,"::ffff:0c22:384e","::ffff:c22:384e");
		this.XTEST(true ,"2001:0db8:1234:0000:0000:0000:0000:0000","2001:db8:1234::");
		this.XTEST(true ,"2001:0db8:1234:ffff:ffff:ffff:ffff:ffff","2001:db8:1234:ffff:ffff:ffff:ffff:ffff");
		this.XTEST(true ,"2001:db8:a::123","2001:db8:a::123");
		this.XTEST(true ,"fe80::","fe80::");
		this.XTEST(true ,"::ffff:192.0.2.128","::ffff:192.0.2.128");
		this.XTEST(true ,"::ffff:c000:280","::ffff:c000:280");

		this.XTEST(false,"123","---");
		this.XTEST(false,"ldkfj","---");
		this.XTEST(false,"2001::FFD3::57ab","---");
		this.XTEST(false,"2001:db8:85a3::8a2e:37023:7334","---");
		this.XTEST(false,"2001:db8:85a3::8a2e:370k:7334","---");
		this.XTEST(false,"1:2:3:4:5:6:7:8:9","---");
		this.XTEST(false,"1::2::3","---");
		this.XTEST(false,"1:::3:4:5","---");
		this.XTEST(false,"1:2:3::4:5:6:7:8:9","---");
		this.XTEST(false,"::ffff:2.3.4","---");
		this.XTEST(false,"::ffff:257.1.2.3","---");
		this.XTEST(false,"1.2.3.4","---");
		
	// Test collapsing zeroes...

		this.XTEST(true ,"a:b:c:d:e:f:f1:f2","a:b:c:d:e:f:f1:f2");
		this.XTEST(true ,"a:b:c::d:e:f:f1","a:b:c:0:d:e:f:f1");
		this.XTEST(true ,"a:b:c::d:e:f","a:b:c::d:e:f");
		this.XTEST(true ,"a:b:c::d:e","a:b:c::d:e");
		this.XTEST(true ,"a:b:c::d","a:b:c::d");
		this.XTEST(true ,"::a","::a");
		this.XTEST(true ,"::a:b:c","::a:b:c");
		this.XTEST(true ,"::a:b:c:d:e:f:f1","0:a:b:c:d:e:f:f1");
		this.XTEST(true ,"a::","a::");
		this.XTEST(true ,"a:b:c::","a:b:c::");
		this.XTEST(true ,"a:b:c:d:e:f:f1::","a:b:c:d:e:f:f1:0");
		this.XTEST(true ,"a:bb:ccc:dddd:000e:00f:0f::","a:bb:ccc:dddd:e:f:f:0");
		this.XTEST(true ,"0:a:0:a:0:0:0:a","0:a:0:a::a");
		this.XTEST(true ,"0:a:0:0:a:0:0:a","0:a::a:0:0:a");
		this.XTEST(true ,"2001:db8:1:1:1:1:0:0","2001:db8:1:1:1:1::");
		this.XTEST(true ,"2001:db8:1:1:1:0:0:0","2001:db8:1:1:1::");
		this.XTEST(true ,"2001:db8:1:1:0:0:0:0","2001:db8:1:1::");
		this.XTEST(true ,"2001:db8:1:0:0:0:0:0","2001:db8:1::");
		this.XTEST(true ,"2001:db8:0:0:0:0:0:0","2001:db8::");
		this.XTEST(true ,"2001:0:0:0:0:0:0:0","2001::");

		this.XTEST(true ,"A:BB:CCC:DDDD:000E:00F:0F::","A:BB:CCC:DDDD:E:F:F:0");

		this.XTEST(true ,"0:0:0:0:0:0:0:0","::");
		this.XTEST(true ,"0:0:0:0:0:0:0:a","::a");
		this.XTEST(true ,"0:0:0:0:a:0:0:0","::a:0:0:0");
		this.XTEST(true ,"0:0:0:a:0:0:0:0","0:0:0:a::");
		this.XTEST(true ,"0:a:0:0:a:0:0:a","0:a::a:0:0:a");
		this.XTEST(true ,"a:0:0:a:0:0:a:a","a::a:0:0:a:a");
		this.XTEST(true ,"a:0:0:a:0:0:0:a","a:0:0:a::a");
		this.XTEST(true ,"a:0:0:0:a:0:0:a","a::a:0:0:a");
		this.XTEST(true ,"a:0:0:0:a:0:0:0","a::a:0:0:0");
		this.XTEST(true ,"a:0:0:0:0:0:0:0","a::");
	 };

	 return IPv6Validator;
	});