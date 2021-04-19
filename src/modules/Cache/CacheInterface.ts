interface CacheInterface {
  get(key:string):Promise<any>;
  set(key: string, value: any, lifetime: number | null):Promise<any>;
}
export default CacheInterface;
