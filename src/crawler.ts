import superagent from 'superagent';


class Crawler {
  private secret = `x3b174jsx`;
  private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
  private rawHTML = ``;

  constructor() {
    this.getRawHTML();
  }

  async getRawHTML() {
    const result = await superagent.get(this.url);
    // console.log(result.text);
    this.rawHTML = result.text;
  }
}

const crawler = new Crawler();