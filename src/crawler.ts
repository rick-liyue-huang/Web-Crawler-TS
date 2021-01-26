
import superagent from 'superagent';  // need .d.ts type file, @types/superagent
import cheerio from 'cheerio';

interface Course  {
  title: string,
  count:  number
}

class Crawler {
  private SECRET: string = `x3b174jsx`; // secretkey
  private url: string = `http://www.dell-lee.com/typescript/demo.html?secret=${this.SECRET}`;
  private rawHTML = ``; // used to store the webpage contents in string type
  constructor() {
    this.getRawHTML();
  }

  /**
   * get the page contents in string type
   */
  async getRawHTML() {
    const result = await superagent.get(this.url);
    // console.log(result.text);
    this.rawHTML = result.text;
    this.getCourseInfo(this.rawHTML);
  }

  getCourseInfo(html: string) {
    const $ = cheerio.load(html);
    const courseItems = $('.course-item');
    // console.log(courseItems.length);
    const courseInfos: Course[] = [];  // define the courseInfo object type by interface
    courseItems.map((index, elem) => {
      const descs = $(elem).find('.course-desc');
      const title = descs.eq(0).text();
      // console.log(title);
      const count = parseInt(descs.eq(1).text().split('：')[1], 10);
      // console.log(title, count);

      courseInfos.push({
        title, count
      });
    });

    const result = {  // add time stamp on result
      time: (new Date()).getTime(),
      data: courseInfos
    }
    console.log(result);
    
  }
}

const crawler = new Crawler();