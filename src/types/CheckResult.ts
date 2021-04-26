class CheckResult {
  provider: string = ''
  isBot: boolean = false;
  info: string = ''

  constructor (provider?:string, isBot?:boolean, info?:string) {
    this.provider = provider ?? '';
    this.isBot = isBot ?? false;
    this.info = info ?? '';
  }
}

export default CheckResult;
