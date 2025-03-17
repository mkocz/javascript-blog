const opts = {
	tagSizes: {
	    count: 5,
	    classPrefix: 'tag-size-',
	},
};

const select = {
	all: {
		articles: '.post',
		linksTo: {
			tags: 'a[href^="#tag-"]',
			authors: 'a[href^="#author-"]',
			activeTags: 'a.active[href^="#tag-"]',
			activeAuthors: 'a.active[href^="#author-"]',
		},
	},
	article: {
		tags: '.post-tags .list',
		author: '.post-author',
		title: '.post-title',
	},
	listOf: {
		titles: '.titles',
		tags: '.tags.list',
		authors: '.authors.list',
	},
};

const titleClickHandler = function(event) {
	event.preventDefault();
	
	const clickedElement = this;
	/* remove class 'active' from all article links  */
	const activeLinks = document.querySelectorAll('.titles a.active');

	for (let activeLink of activeLinks) {
	    activeLink.classList.remove('active');
	}

	/* add class 'active' to the clicked link */
	clickedElement.classList.add('active');

	/* remove class 'active' from all articles */ 
	const activeArticles = document.querySelectorAll('article.active');
  
	for (let activeArticle of activeArticles) {
    	activeArticle.classList.remove('active');
	}

	/* get 'href' attribute from the clicked link */
	const hrefValue = clickedElement.getAttribute('href');
	/* find the correct article using the selector (value of 'href' attribute) */
	const targetArticle = document.querySelector(hrefValue);

	/* add class 'active' to the correct article */
	targetArticle.classList.add('active');
};

const generateTitleLinks = function(customSelector = '') {
	/* remove existing article links */
	const articleLinks = document.querySelector(select.listOf.titles);
	articleLinks.innerHTML = '';
	/* add links to existing articles */
	const allArticles = document.querySelectorAll(select.all.articles + customSelector);
	let html = '';
	
	for(let article of allArticles) {
		/* get the article id */
		const id = article.getAttribute('id');
		/* find the title element */
		const title = article.querySelector(select.article.title).innerHTML;
		/* create HTML of the link */
		const li = '<li><a href="#' + id + '" class="active"><span>' + title + '</span></a></li>';
		
		/* add link to titleList */
		html = html + li;
	}
	
	/* insert all links into titleList */
	articleLinks.insertAdjacentHTML("afterbegin", html);
	
	/* get all title links */
	const links = document.querySelectorAll('.titles a');

	/* add event listeners to all titles */
	for (let link of links) {
		link.addEventListener('click', titleClickHandler);
	}
}

/* generate title links and add event listeners to them */
generateTitleLinks();

function calculateTagsParams(tags) {
	const params = {
		max: 0,
		min: 999999
	}
	
	for(let tag in tags) {
		if( tags[tag] > params.max) {
			params.max = tags[tag];
		}
		
		if( tags[tag] < params.min) {
			params.min = tags[tag];
		}
	}
	return params;
}

function calculateTagsClass(count, params) {
	const classNumber = Math.floor((count - params.min)/(params.max - params.min)*(opts.tagSizes.count-1)) +1;
	return opts.tagSizes.classPrefix + classNumber;
}

function generateTags() {
	/* [NEW] create a new variable allTags with an empty Object */
	let allTags = {};
	/* find all articles */
  	const allArticles = document.querySelectorAll(select.all.articles);

	/* START LOOP: for every article: */
	for (let article of allArticles) {		
	/* find tags wrapper */
	const tagWrapper = article.querySelector(select.article.tags);
	/* make html variable with empty string */
	let html = '';
	/* get tags from data-tags attribute */
	const tags = article.getAttribute('data-tags')
	/* split tags into array */
	const tagsArray = tags.split(" ");

	/* START LOOP: for each tag */
	for (let tag of tagsArray) {
		/* generate HTML of the link */
		const li = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>	';
		/* add generated code to html variable */
		html = html + li;

		/* [NEW] check if this link is NOT already in allTags */
	if(!allTags[tag]) {
	/* [NEW] add tag to allTags object */
		allTags[tag]=1;
	} else {
		allTags[tag]++;
	}
	/* END LOOP: for each tag */
	}
		
	/* insert HTML of all the links into the tags wrapper */
	tagWrapper.insertAdjacentHTML('beforeend', html);
	/* END LOOP: for every article: */
  }
	
	/* [NEW] find list of tags in right column */
  const tagList = document.querySelector(select.listOf.tags);
	const tagsParams = calculateTagsParams(allTags);

	/* [NEW] create variable for all links HTML code */
	let allTagsHTML = '';

	/* [NEW] START LOOP: for each tag in allTags: */
	for(let tag in allTags) {
		/* [NEW] generate code of a link and add it to allTagsHTML */
		allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagsClass(allTags[tag], tagsParams) + '">' + tag +'</a></li>';
	/* [NEW] END LOOP: for each tag in allTags: */
	}

	/*[NEW] add HTML from allTagsHTML to tagList */
	tagList.innerHTML = allTagsHTML;
}

generateTags();

function tagClickHandler(event){
	/* prevent default action for this event */
	event.preventDefault();

	/* make new constant named "clickedElement" and give it the value of "this" */
	const clickedElement = this;
	/* make a new constant "href" and read the attribute "href" of the clicked element */
	const href = clickedElement.getAttribute('href');
	/* make a new constant "tag" and extract tag from the "href" constant */
	const tag = href.replace('#tag-', ''); 
	/* find all tag links with class active */
	const activeTagLinks = document.querySelectorAll(select.all.linksTo.activeTags)
	/* START LOOP: for each active tag link */
	for (let activeTagLink of activeTagLinks) {
		/* remove class active */
		activeTagLink.classList.remove('active');
	/* END LOOP: for each active tag link */
	}
	
	/* find all tag links with "href" attribute equal to the "href" constant */
	const selectedTagLinks= document.querySelectorAll('a[href="' + href  + '"]')
	/* START LOOP: for each found tag link */
	for(let tagLink of selectedTagLinks) {
		/* add class active */
		tagLink.classList.add('active');
	/* END LOOP: for each found tag link */
	}
 
	/* execute function "generateTitleLinks" with article selector as argument */
	generateTitleLinks('[data-tags~="' + tag + '"]')
}

function addClickListenersToTags(){
	/* find all links to tags */
	const allTagLinks = document.querySelectorAll(select.all.linksTo.tags);
	
	/* START LOOP: for each link */
	for (let link of allTagLinks) {	
		/* add tagClickHandler as event listener for that link */
    	link.addEventListener('click', tagClickHandler);
	/* END LOOP: for each link */
	}
}

addClickListenersToTags();

function generateAuthors(){
	const allAuthors = {};
	/* find all articles */
	const allArticles = document.querySelectorAll(select.all.articles);
	const authorList = document.querySelector(select.listOf.authors);

	/* START LOOP: for every article: */
	for (let article of allArticles) {
		/* find author paragraph */
		const authorWrapper = article.querySelector(select.article.author);
		/* make html variable with empty string */
		let html = '';
		/* get author from data-author attribute */
		const author = article.getAttribute('data-author');
		/* create HTML of the link */
		const authorLink = '<a href="#author-' + author + '">' + author + '</a>	';
		
		/* insert HTML of all the links into the tags wrapper */
		authorWrapper.insertAdjacentHTML('beforeend', authorLink);
		
		/* Generate data for allAuthor object*/
		if(!allAuthors[author]){
		/* [NEW] add author to allAuthors object */
		allAuthors[author]=1;
		} else {
			allAuthors[author]++;
		}
	/* END LOOP: for each author */
	}
	
	/* [NEW] create variable for all links HTML code */
	let allAuthorsHTML = '';

	/* [NEW] START LOOP: for each tag in allTags: */
	for(let author in allAuthors){
		/* [NEW] generate code of a link and add it to allTagsHTML */
		allAuthorsHTML += '<li><a href="#author-' + author + '">' + author +'(' + allAuthors[author] +')</a></li>';
	/* [NEW] END LOOP: for each tag in allTags: */
	}
	/*[NEW] add HTML from allTagsHTML to tagList */
	authorList.innerHTML = allAuthorsHTML;
/* END LOOP: for every article: */
}

generateAuthors();

function authorClickHandler(event){
	/* prevent default action for this event */
	event.preventDefault();

	/* make new constant named "clickedElement" and give it the value of "this" */
	const clickedElement = this;
	/* make a new constant "href" and read the attribute "href" of the clicked element */
	const href = clickedElement.getAttribute('href');
	/* find all author links with class active */
	const activeAuthorLinks = document.querySelectorAll(select.all.linksTo.activeAuthors);
	/* START LOOP: for each active tag link */
	for (let activeAuthorLink of activeAuthorLinks) {
		/* remove class active */
		activeAuthorLink.classList.remove('active');
	/* END LOOP: for each active tag link */
	}
	
	/* find all tag links with "href" attribute equal to the "href" constant */
	const selectedAuthorLinks = document.querySelectorAll('a[href="' + href  + '"]');
	/* START LOOP: for each found author link */
	for(let authorLink of selectedAuthorLinks) {
		/* add class active */
		authorLink.classList.add('active');
	/* END LOOP: for each found author link */
	}
 
	/* execute function "generateTitleLinks" with article selector as argument */
	generateTitleLinks('[data-author="' + href.replace('#author-', '') + '"]')
}

function addClickListenersToAuthors(){
	/* find all links to authors */
	const allAuthorLinks = document.querySelectorAll(select.all.linksTo.authors);
	
	/* START LOOP: for each link */
	for (let link of allAuthorLinks) {	
		/* add tagClickHandler as event listener for that link */
		link.addEventListener('click', authorClickHandler);
	/* END LOOP: for each link */
	}
}

addClickListenersToAuthors();

