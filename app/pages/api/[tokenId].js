export default function handler(req, res) {
  // get the tokenId from query params
  const tokenId = req.query.tokenId;
  // we can extract the images from github repo
  const image_url =
    'https://raw.githubusercontent.com/josayko/NFT-Collection/main/app/public/cryptodevs/';
  // The api is sending back metadata for a Crypto Dev
  // To make our collection compatible with Opensea, we need to follow some Metadata standards
  // when sending back the response from the api
  // More info can be found here: https://docs.opensea.io/docs/metadata-standards
  res.status(200).json({
    name: 'Crypto Dev #' + tokenId,
    description: 'CryptoDev is a collection of developpers in crypto',
    image: image_url + tokenId + '.svg'
  });
}
