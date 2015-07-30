function tutorial() {
	var steps = [{
	  content: '<p>These are the "terms" that contians set of genes.</p>'
	  			+'<p>They can be swapped with another terms(rows)</p>',
	  highlightTarget: true,
	  nextButton: true,
	  skipButton: true,
	  target: $('.row_4'),
	  my: 'left top',
	  at: 'left top'
	}, {
	  content: '<p>These are genes within the set. You can swap genes around to align them.</p>',
	  highlightTarget: true,
	  nextButton: true,
	  target: $('.row_4'),
	  my: 'top center',
	  at: 'bottom center'
	}]

	var tour = new Tourist.Tour({
	  steps: steps,
	  tipClass: 'Bootstrap',
	  tipOptions:{ showEffect: 'slidein' }
	});
	tour.start();

}