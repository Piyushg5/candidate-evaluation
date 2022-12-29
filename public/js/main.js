/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-env jquery, browser */
$(document).ready(() => {
  // eslint-disable-next-line camelcase
  $('#add_button').click(() => { // on add input button click
    const objTo = document.getElementById('technical_skills_fields');
    const divtest = document.createElement('div');
    // eslint-disable-next-line prefer-template
    divtest.setAttribute('class', 'form-row');
    divtest.innerHTML += '<div class="form-group col-md-3"><label for="inputEmail4">Technical Skills</label><input type="text" class="form-control" id="inputEmail4" name="technical_skills[]" value="" /></div>';
    divtest.innerHTML += '<div class="form-group col-md-2"><label for="inputPassword4">Rating</label><select class="form-control" aria-label="Default select example" name="ratings[]"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>';
    divtest.innerHTML += '<div class="form-group col-md-2"><label for="inputPassword4">Weightage</label><input type="text" class="form-control" id="inputPassword4" name="weightage[]" value="" /></div>';
    divtest.innerHTML += '<div class="form-group col-md-3"><label for="inputPassword4">Interviewers comment</label><input type="text" class="form-control" id="inputPassword4" name="interviewer_comment[]" value="" /></div><div class="input-group-btn" id="removeRow"><button class="btn btn-danger" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg></button></div>';
    divtest.innerHTML += '</div>';

    objTo.appendChild(divtest);
  });
  $(document).on('click', '#removeRow', function () {
    $(this).closest('.form-row').remove();
  });

  $('#add_attribute_button').click(() => { // on add input button click
    const objTo = document.getElementById('attribute_fields');
    const divtest = document.createElement('div');
    // eslint-disable-next-line prefer-template
    divtest.setAttribute('class', 'form-row');
    divtest.innerHTML += '<div class="form-group col-md-3"><label for="inputEmail4">Other Attributes</label><input type="text" class="form-control" id="inputEmail4" name="other_attribute[]" value="" /></div>';
    divtest.innerHTML += '<div class="form-group col-md-2"><label for="inputPassword4">Rating</label><select class="form-control" aria-label="Default select example" name="other_ratings[]"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>';
    divtest.innerHTML += '<div class="form-group col-md-5"><label for="inputPassword4">Interviewers comment</label><input type="text" class="form-control" id="inputPassword4" name="other_interviewer_comment[]" value="" /></div><div class="input-group-btn" id="removeRow"><button class="btn btn-danger" type="button"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg></button></div>';
    divtest.innerHTML += '</div>';

    objTo.appendChild(divtest);
  });
});
