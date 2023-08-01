const events = [
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
  },
  {
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
  },
  {
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
  },
];

function getEvents() {
  let storedString = localStorage.getItem("gh-events") || "[]";

  let storedEvents = JSON.parse(storedString);

  if (storedEvents.length == 0) {
    storedEvents = events;
    localStorage.setItem("gh-events", JSON.stringify(events));
  }
  return storedEvents;
}

function buildDropDown() {
  // get the current events
  let currentEvents = getEvents();

  // get a list of unique cities
  let eventCities = currentEvents.map((event) => event.city);
  let distinctCities = new Set(eventCities);
  let dropdownChoices = ["All", ...distinctCities];
  const dropdownDiv = document.getElementById("city-dropdown");
  const dropdownItemsTemplate = document.getElementById("dropdown-template");

  buildDropDown.innerHTML = "";
  // with each unique city:

  dropdownChoices.forEach((city) => {
    // - copy the dropdown template
    let dropdownItemsCopy = dropdownItemsTemplate.content.cloneNode(true);
    // - change that copy's text
    let aTag = dropdownItemsCopy.querySelector("a");
    aTag.innerText = city;
    // - put it in the dropdown
    dropdownDiv.appendChild(dropdownItemsCopy);
  });

  document.getElementById("stats-location").textContent = "All";
  displayEvents(currentEvents);
  displayStats(currentEvents);
}

function displayEvents(events) {
  // find the table on the page
  const eventsTable = document.getElementById("events-table");

  // find the table row template
  const eventTemple = document.getElementById("table-row-template");

  // clear out the table
  eventsTable.innerHTML = "";

  // for each event:
  for (let i = 0; i < events.length; i++) {
    // - get one event
    let event = events[i];

    //- clone the template
    let tableRow = eventTemple.content.cloneNode(true);

    // - get each property of an event
    // - insert each property into the cloned template
    let eventNameCell = tableRow.querySelector("[data-id='event']");
    eventNameCell.innerText = event.event;

    tableRow.querySelector("[data-id='city']").innerText = event.city;
    tableRow.querySelector("[data-id='state']").innerText = event.state;
    tableRow.querySelector("[data-id='attendance']").innerText =
      event.attendance;

    // format the date using toLocaleDateString
    let date = new Date(event.date);
    let formattedDate = date.toLocaleDateString();
    tableRow.querySelector("[data-id='date']").innerText = formattedDate;

    eventsTable.appendChild(tableRow);
  }
}

function displayStats(events) {
  let total = 0;
  let max = 0;
  let min = events[0].attendance;
  for (let i = 0; i < events.length; i++) {
    let event = events[i];

    total += event.attendance;
    if (event.attendance > max) {
      max = event.attendance;
    }

    if (event.attendance < min) {
      min = event.attendance;
    }
  }

  let average = total / events.length;

  document.getElementById("total-attendance").innerHTML =
    total.toLocaleString();
  document.getElementById("average-attendance").innerHTML =
    Math.round(average).toLocaleString();
  document.getElementById("max-attended").innerHTML;
  document.getElementById("min-attended").innerHTML;
}

function filterEvents(dropdownItemClicked) {
  let cityName = dropdownItemClicked.innerText;
  document.getElementById("stats-location").textContent = cityName;

  let allEvents = getEvents();

  let filteredEvents = [];


  filteredEvents = allEvents.filter(
    (event) => cityName == "All" || event.city == cityName
  );

 

  displayStats(filteredEvents); // overall stats
  displayEvents(filteredEvents); // table
}

function saveEvent() {
  let eventName = document.getElementById("inputEventName").value;
  let city = document.getElementById("inputCity").value;

  let stateSelect = document.getElementById("newEventState");
  let selectedIndex = stateSelect.selectedIndex;
  let selectedOption = stateSelect.options[selectedIndex];
  let state = selectedOption.text;

  let attendance = parseInt(document.getElementById("inputAttendance").value);

  let date = document.getElementById("inputEventDate").value;
  date = `$(date) 00:00`;

  let newEventDate = new Date(date);

  let newEvent = {
    event: eventName,
    city: city,
    state: state,
    attendance: attendance,
    date: newEventDate,
  };

  let allEvents = getEvents();

  allEvents.push(newEvent);

  localStorage.setItem("gh-events", JSON.stringify(allEvents));

  buildDropDown();

  let modalElement = document.getElementById("addEvent");
  let modal = bootstrap.Modal.getInstance(document.getElementById("addEvent"));
  modal.hide();
}
