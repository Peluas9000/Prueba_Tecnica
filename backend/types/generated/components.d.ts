import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAllergen extends Struct.ComponentSchema {
  collectionName: 'components_shared_allergens';
  info: {
    displayName: 'Allergen';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images' | 'files'>;
    name: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.allergen': SharedAllergen;
    }
  }
}
