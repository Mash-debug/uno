export default interface ShowToastDetail {
  title: TitleToast;
  desc: string;
  variant: VariantToast;
}

type TitleToast = "Erreur" | "Succès" | "Information";
type VariantToast = "danger"| "success" | "warning" | "primary";