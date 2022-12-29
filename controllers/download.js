/* eslint-disable no-unused-vars */
const PDFGenerator = require('pdfkit');
const fs = require('fs');
const configConst = require('../config/constant');

class Download {
  constructor(downloadData, req, res) {
    this.downloadData = downloadData;
    this.res = res;
    this.req = req;
  }

  generateHeaders(doc) {
    const data = this.downloadData;
    let items = {};
    if (this.req.params.from === 'L1') {
      items = this.downloadData.l1_feedback;
    }
    if (this.req.params.from === 'L2') {
      items = this.downloadData.l2_feedback;
    }
    if (this.req.params.from === 'HR') {
      items = this.downloadData.hr_feedback;
    }
    doc
      .image('public/logo.png', 50, 50, { width: 200 })
      .fillColor('#000')
      .fontSize(20)
      .text('FEEDBACK', 275, 50, { align: 'right' })
      .fontSize(10)
      .text(`Name: ${data.candidate_name}`, { align: 'right' })
      .text(`Position: ${configConst.position_applied[data.position_applied]}`, { align: 'right' })
      .text(`Experience: ${data.experience_level}`, { align: 'right' })
      .text(`Contact No.: ${data.contact_no}`, { align: 'right' })
      .text(`Feedback Status: ${configConst.feebackStatus[items.optradio]}`, { align: 'right' })
      .moveDown()
      .text(`Address:\n ${data.address}`, { align: 'right' });
    const beginningOfPage = 50;
    const endOfPage = 550;

    doc.moveTo(beginningOfPage, 200)
      .lineTo(endOfPage, 200)
      .stroke();
    doc
      .fontSize(14)
      .moveTo(beginningOfPage, 400)
      .text(`${this.req.params.from} - Evaluation Feedback`, 220, 220);
    doc
      .fontSize(10)
      .text('(Rating Criteria: 5 - Excelent, 4 - Good, 3- Fair, 2 - Average, 1 - Poor)', 140, 240);
  }

  generateTable(doc) {
    const tableTopSkills = 270;
    const skillPos = 50;
    const rating = 175;
    const weightage = 300;
    const comment = 400;

    doc
      .fontSize(12)
      .text('Technical Skills', skillPos, tableTopSkills, { bold: true })
      .text('Rating', rating, tableTopSkills, { bold: true })
      .text('Weightage', weightage, tableTopSkills, { bold: true })
      .text("Interviewer's comment", comment, tableTopSkills, { bold: true });
    let items = {};
    if (this.req.params.from === 'L1') {
      items = this.downloadData.l1_feedback;
    }
    if (this.req.params.from === 'L2') {
      items = this.downloadData.l2_feedback;
    }
    if (this.req.params.from === 'HR') {
      items = this.downloadData.hr_feedback;
    }
    let { skills, attribute } = items;
    skills = JSON.parse(skills);
    let y = 0;
    for (let i = 0; i < skills.length; i++) { // print technical skills
      const item = skills[i];
      y = tableTopSkills + 25 + (i * 25);

      doc
        .fontSize(10)
        .text(item.technical_skills, skillPos, y)
        .text(item.ratings, rating, y)
        .text(item.weightage, weightage, y)
        .text(item.interviewer_comment, comment, y);
    }
    const attributeHeight = y + 50;
    doc
      .fontSize(12)
      .text('Other Attribute', skillPos, attributeHeight, { bold: true })
      .text('Rating', rating, attributeHeight, { bold: true })
      .text("Interviewer's comment", comment, attributeHeight, { bold: true });
    attribute = JSON.parse(attribute);
    let k = 0;
    for (let j = 0; j < attribute.length; j++) { // print other attribute
      const item = attribute[j];
      k = attributeHeight + 25 + (j * 25);

      doc
        .fontSize(10)
        .text(item.other_attribute, skillPos, k)
        .text(item.other_ratings, rating, k)
        .text(item.other_interviewer_comment, comment, k);
    }
    doc
      .fontSize(14)
      .text('Overall Feedback:', 50, k + 70)
      .moveTo(50, k + 89)
      .lineTo(550, k + 89)
      .stroke();
    doc
      .fontSize(10)
      .text(`\n ${items.write_something}`, 50, k + 85);
  }

  generateFooter(doc) {
    const data = this.downloadData;
    const dateObj = new Date();
    const year = dateObj.getFullYear();
    doc
      .fontSize(10)
      .text(`© ${year} Intelliswift(India) Pvt. Ltd. All Rights Reserved`, 50, 700, { align: 'center' });
  }

  generate() {
    const theOutput = new PDFGenerator();
    const d = new Date();
    const time = d.getTime();

    const fileName = `feedback_${time}.pdf`;

    // pipe to a writable stream which would save the result into the same directory
    const writeStream = fs.createWriteStream(fileName);
    theOutput.pipe(writeStream);

    this.generateHeaders(theOutput);

    theOutput.moveDown();

    this.generateTable(theOutput);

    this.generateFooter(theOutput);

    // write out file
    theOutput.end();
    writeStream.on('finish', () => {
      this.res.download(fileName);
      console.log('fileName', fileName);
    });
  }
}

module.exports = Download;
