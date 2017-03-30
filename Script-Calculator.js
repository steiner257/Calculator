/*
Author: Sunny Patel 3/26
Modified: Jenn Alarcon 3/26
Chaged Expression inttial value
*/

var Calculator = function() {
	this.display = document.getElementById("display").display;

	this.memory = document.getElementById("display").memory;

	this.buttons = document.getElementById("mainbuttons");

	this.currentInput = "";
	this.memoryValue = "";
	this.expression=[];
	this.result = 0;
	this.opMode = false;
	/*
	Author: Sunny Patel 3/26
	Replaces the textfield in the display with input str.
	*/
	this.updateDisplay = function(str) {
		this.display.value = str;
	}

	/*
	Author: Jenn Alarcon 3/28
	Replaces the textfield in the memory field with input str.
	*/
	this.updateMemory = function(str) {
		this.memory.value = str;
	}


	/*
	Author: Sunny Patel & Jenn Alarcon 3/26
	Clears the displays and reset the currentInput
	*/
	this.clear = function() {
		this.updateDisplay("");
		this.updateMemory("");
		this.currentInput = "";
		this.result = 0;
		this.memoryValue = "";
		this.expression=[];
		this.opMode = false;
	}

	/*
	Author: Sunny Patel 3/26
	Updates the expression value based off the input digit
	this.currentInput = #this.expresssionValue*10 + digit

	Modified: Jenn Alarcon 3/26
	Wasn't adding digits right when multiplying by ten. 
	-Minor Change, to just add digit to end of string

	Modified: Jenn Alarcon 3/28
	Added the current number field
	*/
	this.updateCurrentInput = function(digit) {
		this.currentInput += digit;
	}

	/*
	Author: Jenn Alarcon 3/28
	Evaulate expression
	Modified 3/30: (Kenton) changed to match new variables
	and reset the memory and display fields  
	*/

	this.evaluateExpression = function(){

		// Take the values from the expression stack
		var num2 = parseFloat(this.expression.shift());
		var op = this.expression.shift();
		var num1 = parseFloat(this.expression.shift());

		//Perform the specified operation
		if(op == "+"){
			this.result = num1 + num2;
		}else if(op == "*"){
			this.result = num1 * num2;
		}else if(op == "/"){
			this.result = num1 / num2;
		}else if(op == "-"){
			this.result = num1 - num2;
		}

		// Update the current input and memory fields
		this.currentInput = " ";
		this.memoryValue = this.result + " ";
		this.updateMemory(this.memoryValue);
		this.updateDisplay(this.currentInput);

		// Store the result in expression in case the user wants to use this valuae
		this.expression=[this.result];

	}

};

/*
Author: Sunny Patel & Jenn Alarcon & Raphael Huang & Kenton Steiner 3/26
Adds event listeners to calc's buttons.
*/
var addListeners = function(calc) {
	/* Add event listener for the decimal point
	Modified 3/29: Kenton Steiner
	Removed the checkDot value and used indexOf to determine if the decimal
	point was already present in the current value.
	*/
	var dot = calc.buttons.dot;
	var dotFunc = function() {
		// If a decimal point has not been used yet, update the value
		if (calc.currentInput.indexOf('.') == -1) {
			calc.currentInput += this.value;
			calc.updateDisplay(calc.currentInput);
		}
	}		
	dot.addEventListener("click", dotFunc, false);
	
	
	/* Add event listener for = button
	Modified: 3/30 Kenton - Added if statements for different calculator
	states 
	*/
	var equals = calc.buttons.equal;
	var equalsFunc = function() {
		//Add the current number to the expression stack
		calc.expression.unshift(calc.currentInput);
		/* If only a number has been input thus far,
			simply transfer the number to the memory field
		*/
		if (calc.expression.length == 1) {
			calc.memoryValue = calc.currentInput;
			calc.updateMemory(calc.memoryValue);
			calc.updateDisplay("");

		}else if(calc.expression.length == 3){
			calc.evaluateExpression();
		}
	
	} 
	equals.addEventListener("click", equalsFunc, false);
	
	
		/* Add event listener for CLEAR button
		Modified: Kenton (3/30) - Minor Change - removed checkDot variable
		*/
		var clear = calc.buttons.clear;	
		var clearFunc = function() {
			calc.clear();
		}
		clear.addEventListener("click", clearFunc, false);
	
	
		/* Add event listener for each NUMBER button
		Modifications: 3/30 Kenton
		Included if statements for various states the calculator could be
		in when a number is pressed
		*/
		var numberFunc = function() {
			/* If there is a result on the expression stack, clear the
				stack, the memory value, and the memory field
			*/
			if (calc.expression.length == 1) {
				calc.memoryValue = "";
				calc.updateMemory(calc.memoryValue);
				calc.expression = [];
			} /*  If there are two values in the stack, move the operation
					from the Display to the Memory, and clear Display
				*/
			else if (calc.expression.length == 2 && opMode) {
				calc.memoryValue += calc.currentInput + " ";
				calc.updateMemory(calc.memoryValue);
				calc.currentInput = "";
			}
			// Update the currentInput with the number given
			calc.updateCurrentInput(this.value);
			calc.updateDisplay(calc.currentInput);

			// Set opMode to false so the function won't keep updating 
			// memory after an operation has been entered
			opMode = false;
		}
		// retrieve all the elements with the name numbers. This is
		// expected to be all the form elements that are numbers.
		for (var i=0; i < calc.buttons.numbers.length; i++) {
			calc.buttons.numbers[i].addEventListener("click", numberFunc, false);
		}
	
		/*
		add event listener for each OPS button
		*/
		var opsFunc = function(){
	
			// check whether there is just one OPS between two numbers, overwrite the first OPS
			var check = true;	
			var ops = ["+", "-", "*", "/"];
			for (var i =0; i < ops.length && check; i++){
				if(calc.currentInput.length > 0 && calc.currentInput.charAt(calc.currentInput.length - 1) == ops[i]){
					calc.currentInput = calc.currentInput.substring(0, calc.currentInput.length - 1);
				}
			}
	
			// at the beginning, the OPS just can be "-",
			if(calc.currentInput.length == 0 && this.value != "-"){
				check = false;
			}
		
			/* Author: Jenn 3/28
			Modified: Kenton 3/30 - Rewrote the function to have the calculator
			display the values in a different format than previously
			*/
			if (check){
				if (calc.expression.length == 0) {
				//add the number to the expression stack
				calc.expression.unshift(calc.currentInput);
				
				// Update the string in the memory, clear current display
				calc.memoryValue = calc.currentInput + " ";
				calc.updateMemory(calc.memoryValue)
				} else if (calc.expression.length == 2) {
					calc.expression.unshift(calc.currentInput);
				}
				/* If there are three values on the stack
					1. Evaluate the expression
					2. Display the result in the memory field
					3. Clear the expression stack and push the result as the first value
					4. Display the operation selected to perform on 
						the result of the previous expression
				*/
				if(calc.expression.length == 3) {					
					// Call evaluate to perform steps 1 through 3
					calc.evaluateExpression();	
				}
				opMode = true;
				
				//Push the operation onto the expression stack
				calc.expression.unshift(this.value);
				
				//Update the current input Display and currentInput
				calc.currentInput = this.value + " ";
				calc.updateDisplay(calc.currentInput);
			}
	
	} //END OF OPS FUNCTION

	/* Author: Jenn  3/28
	Modified: Kenton (3/30) 
	Made the addEventListener all one line
	*/
	for (var i=0; i < calc.buttons.ops.length; i++) {
		calc.buttons.ops[i].addEventListener("click", opsFunc, false);
	}
}
var calc = new Calculator();
addListeners(calc);
