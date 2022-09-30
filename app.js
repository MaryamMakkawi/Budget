// used desgin pattern IIFE(Immediatly Invoked Function Expressions);

// budget controller;

let budgetController = (function () {
  // Constructor Income
  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // Constructor Expense
  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.precentage = -1;
  };

  // calculate precentage for every item we need add prototype (precentage spceific every item);
  Expense.prototype.calcPrecentage = function (totalInc) {
    if (totalInc > 0) {
      this.precentage = Math.round((this.value / totalInc) * 100);
    } else {
      this.precentage = -1;
    }
  };

  // get value precentage
  Expense.prototype.getPrecentage = function () {
    return this.precentage;
  };

  // create Function budgetTatals
  let calcTotals = function (type) {
    let sum = 0;

    // sum for type totalExp and totalInc
    data.allItem[type].forEach((element) => {
      sum += element.value;
    });
    data.totals[type] = sum;
  };

  // Create data structures
  let data = {
    allItem: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    precentage: 0,
  };

  // return public object
  return {
    addItem: function (type, description, value) {
      let newItem, id;

      // Create id for every new item dynamic id
      if (data.allItem[type].length > 0) {
        id = data.allItem[type][data.allItem[type].length - 1].id + 1;
      } else {
        id = 0;
      }

      // Create new item beased on type Income or Expense
      if (type == "inc") {
        newItem = new Income(id, description, value);
      } else {
        newItem = new Expense(id, description, value);
      }

      // Push new item in array beased on type
      data.allItem[type].push(newItem);

      // return new item
      return newItem;
    },

    calcBudget: function () {
      // 1- calculate Total income and expensses
      calcTotals("inc");
      calcTotals("exp");

      // 2- calculate the budget: income - expensses
      data.budget = data.totals.inc - data.totals.exp;

      // 3- calculate Precentage of income
      if (data.totals.inc > 0) {
        data.precentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.precentage = -1;
      }
    },

    //get Budget
    getBudget: function () {
      return {
        budget: data.budget,
        totalExp: data.totals.exp,
        totalInc: data.totals.inc,
        precentage: data.precentage,
      };
    },

    // call calculate Precentage for element;
    calculatePrecentages: function () {
      data.allItem.exp.forEach((current) => {
        current.calcPrecentage(data.totals.inc);
      });
    },

    // call get Precentage value for element finally return array ther are all Precentages for items ;
    getPrecentages: function () {
      let allPrecentages = data.allItem.exp.map((cur) => {
        return cur.getPrecentage();
      });
      return allPrecentages;
    },

    deleteItem: function (type, id) {
      let i, filterdElement;

      // filterdElement =Array elements this is true for example: [Income:{id:0,discription:pla,value:22}]; and i=id Element;
      // Function filter return element this is true (return item this id will delete);
      filterdElement = data.allItem[type].filter(function (item, index) {
        i = index;
        return item.id == id;
      });

      // if object not exist return false
      if (!filterdElement) {
        return false;
      }

      // Function splice delete element this is id=i From data Structure;
      data.allItem[type].splice(i, 1);
    },
  };
})();

// UI controller;

let uiController = (function () {
  // All variable for handel element
  let domString = {
    //description: '.add__description';
    type: document.querySelector(".add__type"),
    description: document.querySelector(".add__description"),
    value: document.querySelector(".add__value"),
    addBtn: document.querySelector(".add__btn"),
    itemInc: document.querySelector(".income__list"),
    itemExp: document.querySelector(".expenses__list"),
    budget: document.querySelector(".budget__value"),
    income: document.querySelector(".budget__income--value"),
    expenses: document.querySelector(".budget__expenses--value"),
    percentage: document.querySelector(".budget__expenses--percentage"),
    container: document.querySelector(".container"),
    month: document.querySelector(".budget__title--month"),
  };

  // Formatting number
  let formattingNumber = function (num, type) {
    let numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];
    return (type === "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  //  call function for every element node List
  let nodeListForEach = function (list, callBack) {
    for (let i = 0; i < list.length; i++) {
      callBack(list[i], i);
    }
  };

  // return public object
  return {
    // return data from input
    getData: function () {
      return {
        type: domString.type.value,
        description: domString.description.value,
        value: parseFloat(domString.value.value),
      };
    },

    //return all variable for handel element public
    getString: function () {
      return domString;
    },

    //Put string html on DOM beased on type (insert the string on html)
    itemAddUi: function (obj, type) {
      let html;
      if (type == "inc") {
        html = `
        <div class="item clearfix" id="inc-${obj.id}">
               <div class="item__description">${obj.description}</div>
               <div class="right clearfix">
                       <div class="item__value">${formattingNumber(
                         obj.value,
                         "inc"
                       )}</div>
                       <div class="item__delete">
                             <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                       </div>
              </div>
      </div>`;
        domString.itemInc.insertAdjacentHTML("beforeend", html);
      } else if (type == "exp") {
        html = `
        <div class="item clearfix" id="exp-${obj.id}">
              <div class="item__description">${obj.description}</div>
              <div class="right clearfix">
                          <div class="item__value">${formattingNumber(
                            obj.value,
                            "exp"
                          )}</div>
                          <div class="item__percentage">10%</div>
                          <div class="item__delete">
                               <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                         </div>
             </div>
        </div>`;
        domString.itemExp.insertAdjacentHTML("beforeend", html);
      }
    },

    // Clear input after click button
    clearFieldsInput: function () {
      domString.description.value = "";
      domString.value.value = "";
      domString.description.focus();

      // //handel two element through querySelectorAll will return list from element
      // fields = document.querySelectorAll(domString.description + ", " + domString.value);
      // //  for convert list to arry
      // let array = Array.prototype.slice.call(fields);
      // // clear input
      // array.forEach((currentElement, index, arrayOrigin) => {
      //   currentElement[index].value = "";
      // });
      // array[0].focus();
    },

    displayBudgetUi: function (obj) {
      let type;
      obj.budget > 0 ? "inc" : "exp";
      domString.budget.textContent = formattingNumber(obj.budget, type);
      domString.income.textContent = formattingNumber(obj.totalInc, "inc");
      domString.expenses.textContent = formattingNumber(obj.totalExp, "exp");
      if (obj.precentage > 0) {
        domString.percentage.textContent = obj.precentage + "%";
      } else {
        domString.percentage.textContent = "---";
      }
    },

    displayPrecentagesUi: function (precentagesArr) {
      // handel elements after found it in DOM Tree
      let fielde = document.querySelectorAll(".item__percentage");

      // callBack this used in nodeListForEach = function (list, callBack) for every expenses
      nodeListForEach(fielde, function (current, index) {
        if (precentagesArr[index] > 0) {
          current.textContent = precentagesArr[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonthUi: function () {
      let now, year, month, months;
      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();
      domString.month.textContent = months[month] + " " + year;
    },

    changedColor: function () {
      // handle all input
      let fieldes = document.querySelectorAll(
        ".add__type,.add__description,.add__value"
      );

      // for every element input
      nodeListForEach(fieldes, function (current) {
        current.classList.toggle("red-focus");
      });

      // change color for add button
      domString.addBtn.classList.toggle("red");
    },

    itemDeleteUi: function (itemId) {
      // handle element for delete it ;
      let item = document.querySelector("#" + itemId);
      item.parentNode.removeChild(item);

      // WAY 2
      // let item = document.getElementById(itemId);
      // item.remove();
    },
  };
})();

// App controller For interactive bitween two Module;

let controller = (function (budgetControl, uiControl) {
  // Initial function
  let setUp = function () {
    let dom = uiControl.getString();

    // Event handel check
    dom.addBtn.addEventListener("click", addItem);

    // Initial Budget on UI
    calcBudgetControl();

    //  Event handel parent the delete button
    dom.container.addEventListener("click", deleteItem);

    // display Current Date
    uiControl.displayMonthUi();

    // change color input beasd on type - red + green
    dom.type.addEventListener("change", uiControl.changedColor);
  };

  // Function for calculate budget for DRY
  let calcBudgetControl = function () {
    // 1- Calculate the budget
    budgetControl.calcBudget();

    // 2- return budget
    budget = budgetControl.getBudget();

    // 3- Display the budget on UI
    uiControl.displayBudgetUi(budget);
  };

  // Function for update precentages for one item for DRY
  let updatePrecentages = function () {
    let precentages;
    // 1- Calculate the precentages;
    budgetControl.calculatePrecentages();

    // 2- return precentages (read precentages from budget controller);
    precentages = budgetControl.getPrecentages();

    // 3- Display the Update Precentages on UI
    uiControl.displayPrecentagesUi(precentages);
  };

  // Add Item function
  let addItem = function () {
    let input, newItem;
    // 1- Get the filed Input data
    input = uiControl.getData();

    // restrict on input value empty
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2- Add the item to the Budget Controller;
      newItem = budgetControl.addItem(
        input.type,
        input.description,
        input.value
      );

      // 3- Add the item to the UI;
      uiControl.itemAddUi(newItem, input.type);

      // 4- Clear fields input;
      uiControl.clearFieldsInput();

      // 5- Calculate the budget and update the Budget;
      calcBudgetControl();

      // 6- Calculate the Update Precentages for one item;
      updatePrecentages();
    }
  };

  // Delete Item function
  let deleteItem = function (event) {
    let item, splitItem, itemID, itemType;

    // get on the item for id and type through event delegation (form child to parent for the arrive element content id="inc-0")
    item = event.target.parentNode.parentNode.parentNode.parentNode.id;

    // split string through - (inc-0) => ["inc","0"]
    splitItem = item.split("-");
    itemType = splitItem[0];
    itemID = splitItem[1];

    // if element id found
    if (item) {
      // 1- Delete the item from our data structure
      budgetControl.deleteItem(itemType, itemID);

      // 2- Delete the item to UI
      uiControl.itemDeleteUi(item);

      // 3- Re-calculate the budget
      calcBudgetControl();

      // 4- Calculate the Update Precentages for one item;
      updatePrecentages();
    }
  };
  return {
    init: function () {
      return setUp();
    },
  };
})(budgetController, uiController);

// init App
controller.init();
