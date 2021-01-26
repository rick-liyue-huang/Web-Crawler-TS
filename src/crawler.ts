
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';  // need .d.ts type file, @types/superagent
// import cheerio from 'cheerio';
import ContentAnalyzer from './contentanalyzer';
// import OtherAnalyzer from './otheranalyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crawler {
  // private SECRET: string = `x3b174jsx`; // secretkey
  // private url: string = `http://www.dell-lee.com/typescript/demo.html?secret=${this.SECRET}`;
  private rawHTML = ``; // used to store the webpage contents in string type
  private filePath = path.resolve(__dirname, '../data/courseinfo.json');
  
  constructor(private url: string, private analyzer: Analyzer) {
    // this.getRawHTML();
    this.initCrawlerProcess();
  }

  /**
   * get the page contents in string type
   */
  private async getRawHTML() {
    const result = await superagent.get(this.url);
    // console.log(result.text);
    this.rawHTML = result.text;
    // this.getCourseInfo(this.rawHTML);
    return this.rawHTML;
  }

  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  /**
   * combine the upone methods
   */
  private async initCrawlerProcess() {
    // const filePath = path.resolve(__dirname, '../data/courseinfo.json');
    const html = await this.getRawHTML();
    // const courseResult = this.getCourseInfo(html);
    // console.log('courseResult', courseResult);
    // const fileContent = this.generateJSONContent(courseResult);

    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

}

const SECRET: string = `x3b174jsx`; // secretkey
const url: string = `http://www.dell-lee.com/typescript/demo.html?secret=${SECRET}`;
// const analyzer = new ContentAnalyzer();

/**
 * using singleton pattern 
 */
const analyzer = ContentAnalyzer.getInstance();
// const analyzer = new OtherAnalyzer();
new Crawler(url, analyzer);
