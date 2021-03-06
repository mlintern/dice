var settingsCookie = null;
var SPEED = {ACC:0, HOLD:1, BRAKE: 2};
var customLetters = "";
var die_count = 0;
var dice = [];
var count = 0;
var option = "";

var die = function ( id ) {
	this.id = id;
	this.diceTimer = null;
	this.diceSpeed = 0;
	this.speedMode = SPEED.ACC;
	this.locked = false;
}

die.prototype.roll = function () {
	var self = this;
	if (this.diceTimer) {
		clearTimeout(this.diceTimer);
	}
	var pick = Math.floor(Math.random() * customLetters.length);
	var ch = customLetters[pick];
	if (option == 'dice') {
		img = '<span class="die die'+ch+'"></span>';
		$(".Dice[data-die="+this.id+"]").html(img);
		$(".Dice[data-die="+this.id+"]").data('value',ch);
	} else {
		$(".Dice[data-die="+this.id+"]").html(ch);
		$(".Dice[data-die="+this.id+"]").data('value',ch);
	}
	switch (this.speedMode) {
	case 0:
		this.setDiceSpeed(this.diceSpeed - 25);
		if (this.diceSpeed < 50) {
			this.setDiceSpeed(50);
			this.speedMode = SPEED.HOLD;
		}
		break;
	case 2:
		this.setDiceSpeed(this.diceSpeed + 10);
		if (this.diceSpeed > 300) {
			this.stopRolling(this.diceTimer);
			return;
		}
		break;
	}
	this.diceTimer = setTimeout(function(){self.roll()}, this.diceSpeed);
}

die.prototype.fullRoll = function () {
	this.startRoll();
	this.stopRoll();
}

die.prototype.startRoll = function () {
	this.roll();
}

die.prototype.setDiceSpeed = function (speed) {
	this.diceSpeed = speed;
}

die.prototype.stopRoll = function () {
	this.speedMode = SPEED.BRAKE;
}

die.prototype.stopRolling = function () {
	if (this.diceTimer) {
		clearTimeout(this.diceTimer);
	}
	this.setDiceSpeed(300);
	this.speedMode = SPEED.HOLD;
	this.diceTimer = null;
	$(".RollHistory").text($(".RollHistory").text() + $(".Dice[data-die="+this.id+"]").data('value') + " ");
}

function setup() {
	orientationChanged();
	customChanged();
	moreDice(2);
	go()
}

function moreDice(num) {
	for (i=0;i<num;i++) {
		var d = new die(die_count);
		$('.Content').append('<div class="DiceBox"><div class="Dice" data-die="'+die_count+'">&nbsp;</div></div>');
		$('.Dice[data-die='+die_count+']').parent().on('click',function(){
			if ( $(this).hasClass('lock') ) {
				$(this).find('.upper-left').remove();
				$(this).removeClass('lock');
			}else{
				$(this).append('<i class="upper-left fa fa-lock"></i>');
				$(this).addClass('lock');
			}
		});
		d.fullRoll();
		dice.push(d);
		die_count++;
		$('.dice-count').html(die_count);
	}
}

function lessDice(num) {
	for (i=0;i<num;i++) {
		dice.pop();
		$('.DiceBox').last().remove();
		die_count--;
		$('.dice-count').html(die_count);
	}
}

function go() {
	for ( i=0; i<die_count; i++ ) {
		curr_die = dice[i];
		curr_die.diceTimer = null;
		curr_die.diceSpeed = 0;
		curr_die.speedMode = SPEED.ACC;
		
		if ( !$('.Dice[data-die='+curr_die.id+']').parent().hasClass('lock') ) {
		curr_die.fullRoll();
		}
	}
	$(".RollHistory").text($(".RollHistory").text() + ": ");
}

function clearHistory() {
	$(".RollHistory").html("&nbsp;");
}

function customChanged() {
	option = $("input:radio[name=DiceType]:checked").val();
	switch (option) {
		case 'dice':
			customLetters = "123456";
			customLetters = customLetters.split("");
			$('.hint').text('6 Sided Dice Value');
			break;
		case 'num':
			customLetters = "0123456789";
			customLetters = customLetters.split("");
			$('.hint').text('Numbers 0 - 9');
			break;
		case 'alpha':
			customLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			customLetters = customLetters.split("");
			$('.hint').text('Letters A - Z');
			break;
		case 'custom':
			customLetters = $(".CustomLetters").val();
			customLetters = customLetters.replace(/\s/g, "");
			customLetters = customLetters.toUpperCase();
			$(".CustomLetters").val(customLetters);
			$('.hint').text("Custom '"+customLetters+"'");
			if ( $('.CommaDeliminated').is(':checked') ) {
				customLetters = customLetters.split(",");
			}else{
				customLetters = customLetters.split("");
			}
			break;
	}
}

function orientationChanged() {
	if (window.orientation != undefined) {
		landscape = window.orientation != 0 && window.orientation != 180;
	}
	else {
		landscape = window.innerWidth > window.innerHeight;
	}
	setTimeout(function() {window.scrollTo(0,1)}, 1);
}

function debug(msg) {
	var e = $("Debug");
	e.innerHTML += msg + "<br>";
}