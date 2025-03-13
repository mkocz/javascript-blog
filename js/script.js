const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
	optArticleTagsSelector = '.post-tags .list';

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
	const articleLinks = document.querySelector(optTitleListSelector);
	articleLinks.innerHTML = '';
	/* add links to existing articles */
	const allArticles = document.querySelectorAll(optArticleSelector + customSelector);
	let html = '';
	
	for(let article of allArticles) {
		/* get the article id */
		const id = article.getAttribute('id');
		/* find the title element */
		const title = article.querySelector(optTitleSelector).innerHTML;
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

function generateTags(){
  /* find all articles */
	 const allArticles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
	for (let article of allArticles) {
		
    /* find tags wrapper */
		const tagWrapper = article.querySelector(optArticleTagsSelector);
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
    /* END LOOP: for each tag */
		}
		
    /* insert HTML of all the links into the tags wrapper */
		tagWrapper.insertAdjacentHTML('beforeend', html);
		
  /* END LOOP: for every article: */
	}
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
  const activeTagLinks = document.querySelectorAll(optArticleTagsSelector + ' a.active');

  /* START LOOP: for each active tag link */
	for (let activeTagLink of activeTagLinks) {
    /* remove class active */
		 activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
	
  /* find all tag links with "href" attribute equal to the "href" constant */
	const selectedTagLinks = document.querySelectorAll(optArticleTagsSelector + ' a[href="' + href  + '"]');

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
	const allTagLinks = document.querySelectorAll(optArticleTagsSelector + ' a');
	
  /* START LOOP: for each link */
	for (let link of allTagLinks) {	
	/* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();
