// Function to handle stencil selection
function selectStencil(item) {
	// Check if already selected
	if (item.classList.contains('selected')) return;

	// Retrieve empty slots and hidden inputs
	const emptySlots = document.querySelectorAll('#selected-stencils .empty');
	const hiddenInputs = document.querySelectorAll('input[type=hidden].empty');

	// Ensure slots and inputs available
	const remainingEmptySlots = emptySlots.length;
	if (remainingEmptySlots === 0 || hiddenInputs.length === 0) {
		alert('You have already selected the maximum number of stencils.');
		return;
	}

	// Select stencil
	const firstEmptySlot = emptySlots[0];
	const firstHiddenInput = hiddenInputs[0];
	const productName = item.querySelector('span[data-product-name]').getAttribute('data-product-name');

	// Fill slot and input
	firstEmptySlot.innerHTML += item.innerHTML;
	firstEmptySlot.classList.replace('empty', 'active');
	firstHiddenInput.value = productName;
	firstHiddenInput.classList.replace('empty', 'active');

	// Update counts
	document.getElementById('remaining-count').innerText = remainingEmptySlots - 1;
	document.getElementById('leftCount').innerText = document.querySelectorAll('#selected-stencils .active').length;

	// Mark stencil as selected
	const stencilId = firstEmptySlot.getAttribute('data-stencil-id');
	item.classList.add('selected', stencilId);

	// Reassign event listener to the newly added button
	const newButton = firstEmptySlot.querySelector('button');
	if (newButton) {
		newButton.addEventListener('click', removeStencil);
	}

	// Update button state
	updateButtonState();
}

// Function to handle stencil removal
function removeStencil() {
	const slotToRemove = this.closest('.active');
	const stencilId = slotToRemove.getAttribute('data-stencil-id');

	// Clear slot content
	slotToRemove.querySelectorAll('span').forEach(span => span.remove());
	slotToRemove.classList.replace('active', 'empty');

	// Reset hidden input
	const hiddenInput = document.querySelector(`input[type=hidden]#final_${stencilId}`)
	hiddenInput.value = '';
	hiddenInput.classList.replace('active', 'empty');

	// Deselect stencil
	const listItem = document.querySelector(`#stencil-products-listings li.${stencilId}`);
	listItem.classList.remove('selected', stencilId);

	// Update counts
	const remainingEmptySlots = document.querySelectorAll('#selected-stencils .empty').length;
	document.getElementById('remaining-count').innerText = remainingEmptySlots;
	document.getElementById('leftCount').innerText = document.querySelectorAll('#selected-stencils .active').length;

	// Update button state
	updateButtonState();
}

// Function to update button state
function updateButtonState() {
	const remainingEmptySlots = document.querySelectorAll('#selected-stencils .empty').length;
	const button = document.querySelector('.kit-product-btn-wrap button');

	if (remainingEmptySlots === 0) {
		button.removeAttribute('disabled');
		button.querySelector('.button-custom-text').innerText = 'Add to cart';
		button.querySelector('#remaining-count').innerText = '';
	} else {
		button.setAttribute('disabled', 'disabled');
		button.querySelector('.button-custom-text').innerText = 'Selections Remaining';
	}
}

// Function to handle clicks on product filters
function handleProductFilterClick(e) {
	const filterLink = e.target.closest('#product-filters a');
	if (filterLink) {
		e.preventDefault();
		const filterName = filterLink.getAttribute('data-selected');
		updateActiveFilter(filterLink);
		filterListItems(filterName);
	}
}

// Function to handle changes in stencil kit filters
function handleStencilKitFilterChange() {
	const filterName = this.value;
	filterListItems(filterName);
}

// Function to update active filter state
function updateActiveFilter(activeFilterLink) {
	document.querySelectorAll('#product-filters a').forEach(function(el) {
		el.classList.remove('active');
	});
	activeFilterLink.classList.add('active');
}

// Function to filter list items based on the selected filter
function filterListItems(filterName) {
	const listItems = document.querySelectorAll('#stencil-products-listings li');
	listItems.forEach(function(item) {
		const productName = item.getAttribute('data-product-collection');
		item.style.display = (productName && productName.includes(filterName)) ? 'block' : 'none';
	});
}

// Add event listeners for stencil selection
document.querySelectorAll('#stencil-products-listings li').forEach(item => {
	item.addEventListener('click', function() {
		selectStencil(this);
	});
});

// Add initial event listeners to existing buttons for stencil removal
document.querySelectorAll('#selected-stencils button').forEach(button => {
	button.addEventListener('click', removeStencil);
});


// Event listener for clicks/change on product filters
document.addEventListener('click', handleProductFilterClick);
document.getElementById('stencil-kit-filters').addEventListener('change', handleStencilKitFilterChange);