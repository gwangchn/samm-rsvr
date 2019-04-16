let parseTile = {};
//16进制切片解析
parseTile.arcsrv16 = function (urlTileCoord, pixelRatio, projection) {
  var z = urlTileCoord[0];
  var x = urlTileCoord[1];
  var y = - urlTileCoord[2];//取反
  var l = (z.toString(10)).PadLeft(2, '0');
  var r = (x.toString(16)).PadLeft(8, '0');
  var c = (y.toString(16)).PadLeft(8, '0');
  var url = this.get('arcsrv_url') || this.urls.join('');
  return url.replace('{z}', l).replace('{x}', c).replace('{y}', r);
}
//10进制切片解析
parseTile.arcsrv10 = function (urlTileCoord, pixelRatio, projection) {
  var l = urlTileCoord[0];
  var c = urlTileCoord[1];
  var r = - urlTileCoord[2];//取反
  var url = this.get('arcsrv_url') || this.urls.join('');
  return url.replace('{z}', l).replace('{x}', c).replace('{y}', r);
}
//高德切片解析
parseTile.gaodesrv = function (urlTileCoord, pixelRatio, projection) {
  try {
    var z = urlTileCoord[0];
    var x = urlTileCoord[1];
    var y = - urlTileCoord[2] - 1;//取反
    var url = this.get('arcsrv_url') || this.urls.join('');
    return url.replace('{z}', z).replace('{x}', x).replace('{y}', y);
  }
  catch (ex) {
    return '';
  }

}
export default parseTile
