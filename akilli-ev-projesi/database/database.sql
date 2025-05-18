--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-05-18 22:48:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4888 (class 1262 OID 16387)
-- Name: akilliev; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE akilliev WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Turkish_Turkey.1254';


ALTER DATABASE akilliev OWNER TO postgres;

\connect akilliev

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 234 (class 1255 OID 16467)
-- Name: sensor_deger_kontrol(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.sensor_deger_kontrol() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.deger > 80 THEN
        INSERT INTO sensor_log (sensor_id, mesaj)
        VALUES (NEW.sensor_id, 'Uyarı: Yüksek sensor değeri algılandı!');
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.sensor_deger_kontrol() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 16424)
-- Name: cihaz; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cihaz (
    cihaz_id integer NOT NULL,
    oda_id integer,
    cihaz_tipi character varying(50),
    cihaz_adi character varying(100),
    durum boolean DEFAULT false
);


ALTER TABLE public.cihaz OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16423)
-- Name: cihaz_cihaz_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cihaz_cihaz_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cihaz_cihaz_id_seq OWNER TO postgres;

--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 223
-- Name: cihaz_cihaz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cihaz_cihaz_id_seq OWNED BY public.cihaz.cihaz_id;


--
-- TOC entry 220 (class 1259 OID 16398)
-- Name: ev; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ev (
    ev_id integer NOT NULL,
    kullanici_id integer,
    adres text NOT NULL,
    ev_adi character varying(100)
);


ALTER TABLE public.ev OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16389)
-- Name: kullanici; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kullanici (
    kullanici_id integer NOT NULL,
    ad character varying(50) NOT NULL,
    soyad character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    sifre character varying(100) NOT NULL,
    rol character varying(20) DEFAULT 'user'::character varying NOT NULL,
    CONSTRAINT rol_kontrol CHECK (((rol)::text = ANY ((ARRAY['admin'::character varying, 'user'::character varying])::text[])))
);


ALTER TABLE public.kullanici OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16412)
-- Name: oda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.oda (
    oda_id integer NOT NULL,
    ev_id integer,
    oda_adi character varying(50) NOT NULL
);


ALTER TABLE public.oda OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16471)
-- Name: cihaz_detay; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.cihaz_detay AS
 SELECT c.cihaz_id,
    c.cihaz_adi,
    c.cihaz_tipi,
    c.durum,
    o.oda_id,
    o.oda_adi,
    e.ev_id,
    e.ev_adi,
    k.kullanici_id,
    k.ad,
    k.soyad
   FROM (((public.cihaz c
     JOIN public.oda o ON ((c.oda_id = o.oda_id)))
     JOIN public.ev e ON ((o.ev_id = e.ev_id)))
     JOIN public.kullanici k ON ((e.kullanici_id = k.kullanici_id)));


ALTER VIEW public.cihaz_detay OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16476)
-- Name: ev_detay; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.ev_detay AS
 SELECT e.ev_id,
    e.ev_adi,
    e.adres,
    e.kullanici_id,
    k.ad AS kullanici_ad,
    k.soyad AS kullanici_soyad
   FROM (public.ev e
     JOIN public.kullanici k ON ((e.kullanici_id = k.kullanici_id)));


ALTER VIEW public.ev_detay OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16397)
-- Name: ev_ev_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ev_ev_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ev_ev_id_seq OWNER TO postgres;

--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 219
-- Name: ev_ev_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ev_ev_id_seq OWNED BY public.ev.ev_id;


--
-- TOC entry 227 (class 1259 OID 16452)
-- Name: kullanici_cihaz_bilgisi; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.kullanici_cihaz_bilgisi AS
 SELECT (((k.ad)::text || ' '::text) || (k.soyad)::text) AS kullanici_adi,
    e.ev_adi,
    o.oda_adi,
    c.cihaz_adi,
    c.cihaz_tipi,
    c.durum
   FROM (((public.kullanici k
     JOIN public.ev e ON ((k.kullanici_id = e.kullanici_id)))
     JOIN public.oda o ON ((e.ev_id = o.ev_id)))
     JOIN public.cihaz c ON ((o.oda_id = c.oda_id)));


ALTER VIEW public.kullanici_cihaz_bilgisi OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16484)
-- Name: kullanici_gorunum; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.kullanici_gorunum AS
 SELECT kullanici_id,
    ad,
    soyad,
    email,
    rol
   FROM public.kullanici
  ORDER BY kullanici_id;


ALTER VIEW public.kullanici_gorunum OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16388)
-- Name: kullanici_kullanici_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kullanici_kullanici_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kullanici_kullanici_id_seq OWNER TO postgres;

--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 217
-- Name: kullanici_kullanici_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kullanici_kullanici_id_seq OWNED BY public.kullanici.kullanici_id;


--
-- TOC entry 232 (class 1259 OID 16480)
-- Name: oda_detay; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.oda_detay AS
 SELECT o.oda_id,
    o.oda_adi,
    e.ev_id,
    e.ev_adi,
    k.kullanici_id,
    k.ad AS kullanici_ad,
    k.soyad AS kullanici_soyad
   FROM ((public.oda o
     JOIN public.ev e ON ((o.ev_id = e.ev_id)))
     JOIN public.kullanici k ON ((e.kullanici_id = k.kullanici_id)));


ALTER VIEW public.oda_detay OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16411)
-- Name: oda_oda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.oda_oda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.oda_oda_id_seq OWNER TO postgres;

--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 221
-- Name: oda_oda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.oda_oda_id_seq OWNED BY public.oda.oda_id;


--
-- TOC entry 226 (class 1259 OID 16437)
-- Name: sensor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensor (
    sensor_id integer NOT NULL,
    cihaz_id integer,
    sensor_tipi character varying(50),
    deger numeric(5,2),
    olcum_zamani timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sensor OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16458)
-- Name: sensor_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensor_log (
    log_id integer NOT NULL,
    sensor_id integer,
    mesaj text,
    zaman timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sensor_log OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16457)
-- Name: sensor_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensor_log_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_log_log_id_seq OWNER TO postgres;

--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 228
-- Name: sensor_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensor_log_log_id_seq OWNED BY public.sensor_log.log_id;


--
-- TOC entry 225 (class 1259 OID 16436)
-- Name: sensor_sensor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensor_sensor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_sensor_id_seq OWNER TO postgres;

--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 225
-- Name: sensor_sensor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensor_sensor_id_seq OWNED BY public.sensor.sensor_id;


--
-- TOC entry 4691 (class 2604 OID 16427)
-- Name: cihaz cihaz_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cihaz ALTER COLUMN cihaz_id SET DEFAULT nextval('public.cihaz_cihaz_id_seq'::regclass);


--
-- TOC entry 4689 (class 2604 OID 16401)
-- Name: ev ev_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ev ALTER COLUMN ev_id SET DEFAULT nextval('public.ev_ev_id_seq'::regclass);


--
-- TOC entry 4687 (class 2604 OID 16392)
-- Name: kullanici kullanici_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanici ALTER COLUMN kullanici_id SET DEFAULT nextval('public.kullanici_kullanici_id_seq'::regclass);


--
-- TOC entry 4690 (class 2604 OID 16415)
-- Name: oda oda_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oda ALTER COLUMN oda_id SET DEFAULT nextval('public.oda_oda_id_seq'::regclass);


--
-- TOC entry 4693 (class 2604 OID 16440)
-- Name: sensor sensor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor ALTER COLUMN sensor_id SET DEFAULT nextval('public.sensor_sensor_id_seq'::regclass);


--
-- TOC entry 4695 (class 2604 OID 16461)
-- Name: sensor_log log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_log ALTER COLUMN log_id SET DEFAULT nextval('public.sensor_log_log_id_seq'::regclass);


--
-- TOC entry 4878 (class 0 OID 16424)
-- Dependencies: 224
-- Data for Name: cihaz; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cihaz (cihaz_id, oda_id, cihaz_tipi, cihaz_adi, durum) FROM stdin;
14	10	Lamba	Yatak Odası Lambası	f
13	9	Lamba	Teras Lambası	f
11	8	Klima	Salon Kliması	f
12	8	Nem Ölçer	Salon Nem Cihazı	f
10	8	Lamba	Salon Lambası	f
\.


--
-- TOC entry 4874 (class 0 OID 16398)
-- Dependencies: 220
-- Data for Name: ev; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ev (ev_id, kullanici_id, adres, ev_adi) FROM stdin;
5	9	Bursa Nilüfer	Ana Ev
6	9	Balıkesir Edremit	Yazlık
7	10	Bursa Görükle	Ana Ev
\.


--
-- TOC entry 4872 (class 0 OID 16389)
-- Dependencies: 218
-- Data for Name: kullanici; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.kullanici (kullanici_id, ad, soyad, email, sifre, rol) FROM stdin;
8	admin	Admin	admin@gmail.com	admin	admin
10	Nevzat	Cömert	nevzat@gmail.com	$2b$10$k51PY.HKQ1k3oOc/BXZZbOsP0AjoF0FGpji793sQUS6Fy38v/n2VO	user
11	Melih	İyigören	melih@gmail.com	$2b$10$jdD5IZqkMrmVb9FrD5ebMeJ66UnkSUQidjaYFXIeuN/Jp72G5.wgi	user
13	Mustafa	Kaya	mustafa@gmail.com	1234	user
14	Seyit	Üzeyir	seyit@gmail.com	1234	user
9	Ömer	Yılmaz	omeryilmaz@gmail.com	1234	user
\.


--
-- TOC entry 4876 (class 0 OID 16412)
-- Dependencies: 222
-- Data for Name: oda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.oda (oda_id, ev_id, oda_adi) FROM stdin;
8	5	Salon
9	6	Teras
10	6	Yatak Odası
\.


--
-- TOC entry 4880 (class 0 OID 16437)
-- Dependencies: 226
-- Data for Name: sensor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sensor (sensor_id, cihaz_id, sensor_tipi, deger, olcum_zamani) FROM stdin;
7	12	Nem	45.00	2025-05-18 02:29:00
8	11	Isı	25.00	2025-05-18 17:24:00
\.


--
-- TOC entry 4882 (class 0 OID 16458)
-- Dependencies: 229
-- Data for Name: sensor_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sensor_log (log_id, sensor_id, mesaj, zaman) FROM stdin;
\.


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 223
-- Name: cihaz_cihaz_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cihaz_cihaz_id_seq', 14, true);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 219
-- Name: ev_ev_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ev_ev_id_seq', 7, true);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 217
-- Name: kullanici_kullanici_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kullanici_kullanici_id_seq', 14, true);


--
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 221
-- Name: oda_oda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.oda_oda_id_seq', 10, true);


--
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 228
-- Name: sensor_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sensor_log_log_id_seq', 2, true);


--
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 225
-- Name: sensor_sensor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sensor_sensor_id_seq', 8, true);


--
-- TOC entry 4708 (class 2606 OID 16430)
-- Name: cihaz cihaz_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cihaz
    ADD CONSTRAINT cihaz_pkey PRIMARY KEY (cihaz_id);


--
-- TOC entry 4704 (class 2606 OID 16405)
-- Name: ev ev_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ev
    ADD CONSTRAINT ev_pkey PRIMARY KEY (ev_id);


--
-- TOC entry 4700 (class 2606 OID 16396)
-- Name: kullanici kullanici_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanici
    ADD CONSTRAINT kullanici_email_key UNIQUE (email);


--
-- TOC entry 4702 (class 2606 OID 16394)
-- Name: kullanici kullanici_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kullanici
    ADD CONSTRAINT kullanici_pkey PRIMARY KEY (kullanici_id);


--
-- TOC entry 4706 (class 2606 OID 16417)
-- Name: oda oda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oda
    ADD CONSTRAINT oda_pkey PRIMARY KEY (oda_id);


--
-- TOC entry 4714 (class 2606 OID 16466)
-- Name: sensor_log sensor_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_log
    ADD CONSTRAINT sensor_log_pkey PRIMARY KEY (log_id);


--
-- TOC entry 4712 (class 2606 OID 16443)
-- Name: sensor sensor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor
    ADD CONSTRAINT sensor_pkey PRIMARY KEY (sensor_id);


--
-- TOC entry 4709 (class 1259 OID 16450)
-- Name: idx_cihaz_durum; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_cihaz_durum ON public.cihaz USING btree (durum);


--
-- TOC entry 4698 (class 1259 OID 16449)
-- Name: idx_kullanici_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_kullanici_email ON public.kullanici USING btree (email);


--
-- TOC entry 4710 (class 1259 OID 16451)
-- Name: idx_sensor_tipi; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sensor_tipi ON public.sensor USING btree (sensor_tipi);


--
-- TOC entry 4720 (class 2620 OID 16468)
-- Name: sensor sensor_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER sensor_trigger AFTER INSERT ON public.sensor FOR EACH ROW EXECUTE FUNCTION public.sensor_deger_kontrol();


--
-- TOC entry 4717 (class 2606 OID 16431)
-- Name: cihaz cihaz_oda_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cihaz
    ADD CONSTRAINT cihaz_oda_id_fkey FOREIGN KEY (oda_id) REFERENCES public.oda(oda_id) ON DELETE CASCADE;


--
-- TOC entry 4715 (class 2606 OID 16406)
-- Name: ev ev_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ev
    ADD CONSTRAINT ev_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanici(kullanici_id) ON DELETE CASCADE;


--
-- TOC entry 4719 (class 2606 OID 16493)
-- Name: sensor_log fk_sensor_log_sensor_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor_log
    ADD CONSTRAINT fk_sensor_log_sensor_id FOREIGN KEY (sensor_id) REFERENCES public.sensor(sensor_id) ON DELETE CASCADE;


--
-- TOC entry 4716 (class 2606 OID 16418)
-- Name: oda oda_ev_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.oda
    ADD CONSTRAINT oda_ev_id_fkey FOREIGN KEY (ev_id) REFERENCES public.ev(ev_id) ON DELETE CASCADE;


--
-- TOC entry 4718 (class 2606 OID 16444)
-- Name: sensor sensor_cihaz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensor
    ADD CONSTRAINT sensor_cihaz_id_fkey FOREIGN KEY (cihaz_id) REFERENCES public.cihaz(cihaz_id) ON DELETE CASCADE;


-- Completed on 2025-05-18 22:48:07

--
-- PostgreSQL database dump complete
--

