export type TQuayData = {
  quay: {
    name: string;
    description?: string;
    publicCode?: string;
    estimatedCalls: TDeparture[];
  };
};

export type TStopPlaceData = {
  stopPlace: {
    name: string;
    estimatedCalls: TDeparture[];
  };
};

export type TDeparture = {
  destinationDisplay: {
    frontText: string;
  };
  aimedDepartureTime: string;
  expectedDepartureTime: string;
  serviceJourney: {
    id: string;
    transportMode: string;
    transportSubmode: string;
    line: {
      publicCode: string;
      authority: {
        name: string;
      };
      presentation: {
        textColour?: string;
        colour?: string;
      };
    };
  };
  cancellation: boolean;
  situations: TSituation[];
};

export type TSituation = {
  id: string;
  description: TSituationText[];
  summary: TSituationText[];
};

type TSituationText = {
  value: string;
  language: string;
};