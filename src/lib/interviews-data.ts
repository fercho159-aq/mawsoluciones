import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

export type InterviewPostType = {
  id: string;
  slug: string;
  title: string;
  category: "Entrevistas";
  image?: ImagePlaceholder;
  excerpt: string;
  date: string;
  author: string;
  content: string;
};

export const interviews: InterviewPostType[] = [
  {
    id: "entrevista-chumel-torres",
    slug: "entrevista-chumel-torres",
    title: "Chumel Torres: La Comedia como Escudo y el Éxito como Consecuencia",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-chumel'),
    excerpt: "Una conversación sin filtros sobre los inicios de 'El Pulso de la República', la soledad del éxito, el manejo de la crítica y la evolución del comediante que se convirtió en un referente de opinión.",
    date: "2024-05-15T10:00:00.000Z",
    author: "Aldo Trejo",
    content: `
      <p>“No lo sé, yo creo que como en la vida, uno nunca sabe si la decisión que va a tomar es la correcta, uno simplemente la toma”, confiesa Chumel Torres, recordando los inicios casi accidentales de “El Pulso de la República”. En una charla íntima, el ingeniero mecánico que se convirtió en uno de los comunicadores más influyentes de México nos abre las puertas a su proceso creativo, sus miedos y la filosofía que lo mantiene anclado a la realidad.</p>
      <p>Chumel no aspiraba a la fama; aspiraba a la expresión. “Empecé a hacer esto porque me divertía, porque me gustaba escribir y me gustaba hacer reír a mis amigos”, comenta. Lo que comenzó como un hobby, una válvula de escape a la rutina corporativa, rápidamente se transformó en un fenómeno. La clave, según él, fue la autenticidad. “No había un plan de negocios, no había una estrategia de monetización. Era pura pasión y, creo, eso fue lo que conectó”.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">El Vértigo del Éxito y la Soledad del Creador</h3>
      <p>El éxito, sin embargo, trajo consigo sus propios demonios. “De repente, eres esta figura pública y todo el mundo opina sobre ti. La gente cree que te conoce porque ve 15 minutos de ti a la semana”, reflexiona. Chumel habla de la “soledad del corredor de fondo” que experimenta el creador de contenido, una desconexión entre la persona y el personaje que puede ser abrumadora.</p>
      <p>¿Cómo lidiar con ello? Para Torres, la respuesta está en el humor y en su equipo. “La comedia es un mecanismo de defensa increíble. Te permite procesar la realidad, por más dura que sea, y devolverla en una forma que la gente pueda digerir”, explica. Su equipo, “los máquinas”, como los llama cariñosamente, son su ancla. “Son mis amigos, mi familia. Ellos me recuerdan quién soy cuando el ruido de afuera es demasiado fuerte”.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">Crítica, Cancelación y la Responsabilidad de la Sátira</h3>
      <p>En un país polarizado, la sátira política es un campo minado. Chumel ha enfrentado críticas feroces y múltiples intentos de “cancelación”. Lejos de victimizarse, lo ve como parte del oficio. “Si te dedicas a esto, tienes que tener la piel gruesa. La crítica es inevitable, y a veces, necesaria”.</p>
      <p>Sin embargo, traza una línea clara. “Una cosa es la crítica y otra el acoso. Cuando intentan silenciarte con amenazas o doxing, ya no estamos hablando de libertad de expresión”. Su enfoque es la consistencia. “No me importa de qué partido seas; si haces algo estúpido, te va a tocar. La sátira no tiene filiaciones, tiene un compromiso con señalar lo absurdo, venga de donde venga”.</p>
      <p>“Al final del día”, concluye con una sonrisa irónica, “lo único que quiero es hacer el programa que a mí me gustaría ver. Si a la gente le gusta, increíble. Si no, pues también. Yo me divierto haciéndolo. El éxito es solo una consecuencia de la diversión”. En esa frase, quizás, reside el verdadero secreto del Pulso: la honestidad brutal de un hombre que, a pesar de todo, se niega a tomarse demasiado en serio a sí mismo.</p>
    `
  },
  {
    id: "entrevista-roberto-martinez",
    slug: "entrevista-roberto-martinez",
    title: "Roberto Martínez: La Arquitectura de las Ideas en la Era Digital",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-roberto'),
    excerpt: "Desde los secretos de su podcast 'Creativo' hasta su visión sobre la monetización de la pasión y la IA, Roberto Martínez deconstruye el proceso de transformar la curiosidad en una carrera.",
    date: "2024-04-20T10:00:00.000Z",
    author: "Aldo Trejo",
    content: `
      <p>“La creatividad no es un don, es un músculo. Y como cualquier músculo, si no lo ejercitas, se atrofia”. Con esta premisa, Roberto Martínez ha construido un imperio de contenido que abarca podcasts, libros y una de las comunidades más fieles de la creación digital en habla hispana. En esta conversación, el arquitecto de formación nos comparte los planos de su éxito.</p>
      <p>Para Roberto, todo comienza con la curiosidad. “Mi podcast ‘Creativo’ nació de un deseo egoísta: quería hablar con la gente que admiro. Quería entender cómo piensan, cómo trabajan”, admite. Esa curiosidad genuina es el motor que ha atraído a millones de personas. “No sigo tendencias. Busco conversaciones que a mí me parecen interesantes. La autenticidad es el mejor algoritmo de recomendación”.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">Monetizar la Pasión sin Vender el Alma</h3>
      <p>Uno de los mayores desafíos para los creadores es encontrar el equilibrio entre la pasión y la rentabilidad. Roberto lo tiene claro: “El dinero es una consecuencia, no el objetivo. Si tu única meta es hacerte rico, la gente lo nota y se aleja. El objetivo es aportar valor”.</p>
      <p>Su estrategia de monetización es diversificada pero coherente. “Mis libros, los cursos, los patrocinios… todo está conectado con la misión de ‘Creativo’: explorar y potenciar la creatividad. Nunca promocionaría algo en lo que no creo”. Advierte a los nuevos creadores sobre el peligro de las “métricas de vanidad”. “Tener un millón de seguidores no significa nada si no tienes una comunidad que confíe en ti. Prefiero tener 100 fans verdaderos que un millón de espectadores pasivos”.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">La Inteligencia Artificial como Herramienta, no como Reemplazo</h3>
      <p>Como alguien inmerso en la tecnología y el futuro, Roberto tiene una visión pragmática sobre la IA. “La IA es la herramienta más poderosa que hemos tenido desde la imprenta. Ignorarla es como un arquitecto negándose a usar una computadora”.</p>
      <p>Lejos de verla como una amenaza, la ve como un potenciador. “La IA puede hacer el trabajo pesado: transcribir entrevistas, generar ideas iniciales, analizar datos. Eso te libera para hacer lo que solo un humano puede hacer: tener una perspectiva única, hacer preguntas inesperadas, conectar emocionalmente”.</p>
      <p>“El futuro no pertenece a los que temen a la IA, sino a los que aprenden a colaborar con ella. El creador que sepa hacerle las preguntas correctas a la máquina será imparable”, sentencia.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">El Proceso Creativo Desmitificado</h3>
      <p>Roberto rechaza la idea del creador como un genio solitario que espera la inspiración divina. “Mi proceso es disciplinado. Es un trabajo. Leo constantemente, apunto ideas, preparo mis entrevistas. La creatividad es el resultado de la estructura y la constancia”.</p>
      <p>Su consejo para quienes empiezan es simple: “Empieza ya. No esperes a tener el equipo perfecto o la idea perfecta. Publica tu primer video, escribe tu primer post. El 90% de lo que hagas al principio será malo, y está bien. Es parte del proceso de encontrar tu voz. La única forma de aprender a crear es creando”.</p>
    `
  },
  {
    id: "entrevista-ricardo-perez-la-cotorrisa",
    slug: "entrevista-ricardo-perez-la-cotorrisa",
    title: "Ricardo Pérez: El Arquitecto del Caos Organizado de La Cotorrisa",
    category: "Entrevistas",
    image: PlaceHolderImages.find(p => p.id === 'interview-ricardo'),
    excerpt: "Hablamos con una de las mitades del podcast de comedia más exitoso de México sobre la improvisación como método, la relación con los fans y el negocio detrás de las anécdotas.",
    date: "2024-03-10T10:00:00.000Z",
    author: "Aldo Trejo",
    content: `
      <p>“La gente cree que solo llegamos y decimos tonterías. Y sí, pero hay un método detrás de la tontería”. Ricardo Pérez, co-creador de “La Cotorrisa”, se ríe mientras intenta explicar el fenómeno que, junto a Slobotzky, ha construido. Lo que parece una charla de bar improvisada es, en realidad, un delicado acto de equilibrio entre el caos y la estructura.</p>
      <p>“La Cotorrisa no es un guion, es un formato”, aclara Ricardo. “El formato es la clave. Tenemos secciones, tenemos un ritmo, sabemos cuándo acelerar y cuándo dejar que una anécdota respire. La improvisación ocurre dentro de esa estructura. Es un caos organizado”.</p>
      <p>La química entre él y Slobotzky es el motor. “Nos conocemos desde hace años. Hay una confianza ciega. Sé que si lanzo una idea, él la va a atrapar y la va a hacer más grande. Y viceversa. Es un partido de tenis verbal, y lo más importante es que nos divertimos genuinamente jugándolo”.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">De Anécdotas a un Modelo de Negocio</h3>
      <p>El podcast se financia principalmente a través de giras en vivo y patrocinios, pero Ricardo es selectivo. “Nuestro público es muy inteligente. Saben cuándo algo es forzado. Solo trabajamos con marcas que entendemos y que nos dan libertad creativa para integrar la publicidad a nuestro estilo”.</p>
      <p>El verdadero “producto” de La Cotorrisa, sin embargo, es la comunidad. “El anecdotario es el corazón del programa. No somos nosotros, son las historias de la gente. Nosotros solo somos los narradores”. Esta interacción constante ha creado una de las comunidades más leales del podcasting en español. “Los fans no son números, son parte del show. Cuando estamos de gira, se siente como una reunión de amigos gigantesca”.</p>
      <h3 class="font-headline text-2xl font-bold mt-8 mb-4">La Comedia en Tiempos de lo Políticamente Correcto</h3>
      <p>Navegar el humor en la era actual es complejo, pero Ricardo tiene una filosofía clara. “La comedia tiene que ser incómoda a veces. Tiene que empujar los límites. Pero hay una diferencia entre ser provocador y ser cruel”.</p>
      <p>“Nuestro humor se basa en la observación de lo cotidiano, en la vulnerabilidad. Nos reímos de nosotros mismos antes que de nadie más. Y cuando contamos una anécdota de un fan, nos reímos de la situación, no de la persona. Creo que esa es la clave para no cruzar la línea”.</p>
      <p>A pesar del éxito masivo, Ricardo mantiene los pies en la tierra. “Al final, solo somos dos amigos contando historias. El día que dejemos de disfrutarlo, se acaba. La Cotorrisa es exitosa porque es honesta. Y mientras esa honestidad siga ahí, la gente seguirá escuchando”.</p>
    `
  }
];
