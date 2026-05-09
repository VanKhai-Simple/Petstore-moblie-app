export const imageMap = {
  'WildernessSalmonBlend.png': require('../../assets/WildernessSalmonBlend.png'),
  'Grain-FreePuppyFreast.png': require('../../assets/Grain-FreePuppyFreast.png'),
  'HarvestVenison&SweetPotato.png': require('../../assets/HarvestVenison&SweetPotato.png'),
  'SeniorCareVitalityMix.png': require('../../assets/SeniorCareVitalityMix.png'),
  'RawFreeze-DriedBeef.png': require('../../assets/RawFreeze-DriedBeef.png'),
  'WildAtlanticSalmonKibble.png': require('../../assets/WildAtlanticSalmonKibble.png'),
  'Cloud-SootheOrthopedicBed.png': require('../../assets/Cloud-SootheOrthopedicBed.png'),
  'Cloud-TouchOrthopedicNest.png': require('../../assets/Cloud-TouchOrthopedicNest.png'),
  'CashmereBlendThrow.png': require('../../assets/CashmereBlendThrow.png'),
  'SculptedCeramicDuo.png': require('../../assets/SculptedCeramicDuo.png'),
  'OrganicCottonRopeSet.png': require('../../assets/OrganicCottonRopeSet.png'),
  'BotanicalBathRitual.png': require('../../assets/BotanicalBathRitual.png')
};

export const resolveProductImage = (imageUrl) => {
  if (imageUrl?.startsWith('http://') || imageUrl?.startsWith('https://')) {
    return { uri: imageUrl };
  }

  const key = imageUrl?.split('/').pop() ?? '';
  return imageMap[key] ?? require('../../assets/placeholder.png');
};
