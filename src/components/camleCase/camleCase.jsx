export default function CamleCase({element}) {
    const profession = element;
    let result = "";
    for (let i = 0; i < profession?.length; i++) {
      if (i == 0) result += profession.charAt(i).toUpperCase();
      else {
        result += profession.charAt(i);
      }
    }
    return result;
  }